// Gera data/export/comparativo.sqlite a partir dos JSON. Usa o SQLite embutido no Node (22.13 ou mais).
import { readFileSync, mkdirSync, rmSync, renameSync } from 'node:fs';
let DatabaseSync;
try { ({ DatabaseSync } = await import('node:sqlite')); }
catch { console.error(`erro: o módulo node:sqlite não existe no Node ${process.versions.node}; use o Node 22.13 ou mais.`); process.exit(1); }
const ler = p => JSON.parse(readFileSync(p, 'utf8'));
const linhas = ler('data/linhas.json');
const fontes = ler('data/fontes.json');
const radar = ler('data/radar.json');
const { gerado, carros } = ler('data/manifest.json');

const destino = 'data/export/comparativo.sqlite', tmp = destino + '.tmp';
mkdirSync('data/export', { recursive: true });
rmSync(tmp, { force: true });
const db = new DatabaseSync(tmp);
db.exec(`
PRAGMA foreign_keys = ON;
CREATE TABLE metadados (chave TEXT PRIMARY KEY, valor TEXT);
CREATE TABLE categorias (id TEXT PRIMARY KEY, nome TEXT NOT NULL, peso INTEGER NOT NULL);
CREATE TABLE estados (id TEXT PRIMARY KEY, descricao TEXT NOT NULL);
CREATE TABLE linhas (
  id TEXT PRIMARY KEY, ordem INTEGER NOT NULL, secao TEXT, rotulo TEXT NOT NULL,
  categoria_id TEXT REFERENCES categorias(id)  -- nulo: item informativo, não pontua
);
CREATE TABLE fontes (id TEXT PRIMARY KEY, titulo TEXT, url TEXT, tipo TEXT);
CREATE TABLE carros (
  id TEXT PRIMARY KEY, nome TEXT NOT NULL, marca TEXT NOT NULL, tecnologia TEXT NOT NULL,
  carroceria TEXT NOT NULL, combustivel TEXT NOT NULL, status TEXT, finalista INTEGER, subtitulo TEXT,
  preco_tabela INTEGER NOT NULL, preco_oferta INTEGER, oferta_nota TEXT, preco_consultado TEXT, observacao TEXT
);
CREATE TABLE carro_fontes (
  carro_id TEXT NOT NULL REFERENCES carros(id), fonte_id TEXT NOT NULL REFERENCES fontes(id),
  PRIMARY KEY (carro_id, fonte_id)
);
CREATE TABLE valores (
  carro_id TEXT NOT NULL REFERENCES carros(id), linha_id TEXT NOT NULL REFERENCES linhas(id),
  estado TEXT REFERENCES estados(id), texto TEXT,
  PRIMARY KEY (carro_id, linha_id)
);
CREATE TABLE valor_fontes (
  carro_id TEXT NOT NULL, linha_id TEXT NOT NULL, fonte_id TEXT NOT NULL REFERENCES fontes(id),
  PRIMARY KEY (carro_id, linha_id, fonte_id), FOREIGN KEY (carro_id, linha_id) REFERENCES valores(carro_id, linha_id)
);
CREATE TABLE radar (id INTEGER PRIMARY KEY, nome TEXT NOT NULL, situacao TEXT, fonte TEXT);
CREATE VIEW v_valores AS
  SELECT c.id AS carro_id, c.nome AS carro, l.id AS linha_id, l.rotulo AS item, l.secao, k.nome AS categoria,
         v.estado, v.texto, l.ordem
  FROM valores v JOIN carros c ON c.id = v.carro_id JOIN linhas l ON l.id = v.linha_id
  LEFT JOIN categorias k ON k.id = l.categoria_id;
`);

const ins = (tabela, n) => db.prepare(`INSERT INTO ${tabela} VALUES (${Array(n).fill('?').join(', ')})`);
db.exec('BEGIN');
const meta = ins('metadados', 2);
meta.run('versao_dados', linhas.versao); meta.run('teto_preco', String(linhas.teto)); meta.run('manifesto_gerado', gerado);
const cat = ins('categorias', 3);
for (const [id, k] of Object.entries(linhas.categorias)) cat.run(id, k.nome, k.peso);
const est = ins('estados', 2);
for (const [id, d] of Object.entries(linhas.estados)) est.run(id, d);
const lin = ins('linhas', 5);
let secao = null, ordem = 0;
for (const l of linhas.linhas) { if (!l.id) { secao = l.secao ?? null; continue; } lin.run(l.id, ++ordem, secao, l.rotulo, l.categoria ?? null); }
const fon = ins('fontes', 4);
for (const [id, f] of Object.entries(fontes)) fon.run(id, f.titulo ?? null, f.url || null, f.tipo ?? null);
const car = ins('carros', 14), cf = ins('carro_fontes', 2), val = ins('valores', 4), vf = ins('valor_fontes', 3);
const ESTADOS = new Set(Object.keys(linhas.estados));
for (const id of carros) {
  const c = ler(`data/carros/${id}.json`);
  car.run(c.id, c.nome, c.marca, c.tecnologia, c.carroceria, c.combustivel, c.status ?? null,
    c.finalista === undefined ? null : Number(c.finalista), c.subtitulo ?? null, c.preco.tabela, c.preco.oferta ?? null,
    c.preco.oferta_nota ?? null, c.preco.consultado ?? null, c.observacao ?? null);
  for (const f of c.fontes || []) cf.run(c.id, f);
  for (const [lid, v] of Object.entries(c.valores)) {
    if (typeof v === 'string') { ESTADOS.has(v) ? val.run(c.id, lid, v, null) : val.run(c.id, lid, null, v); continue; }
    val.run(c.id, lid, v.e ?? null, v.t ?? null);
    for (const f of v.f || []) vf.run(c.id, lid, f);
  }
}
const rad = ins('radar', 4);
radar.forEach((r, i) => rad.run(i + 1, r.nome, r.situacao ?? null, r.fonte || null));
db.exec('COMMIT');
db.exec('VACUUM');
db.close();
renameSync(tmp, destino);
console.log(`sqlite: ${carros.length} carros`);
