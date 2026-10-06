// Valida os dados antes de publicar. Sai com erro se algo estiver inconsistente.
import { readFileSync, readdirSync } from 'node:fs';
const ler = p => JSON.parse(readFileSync(p, 'utf8'));
const erros = [], avisos = [];
const linhas = ler('data/linhas.json');
const fontes = ler('data/fontes.json');
const manifest = ler('data/manifest.json');
const ids = linhas.linhas.filter(l => l.id).map(l => l.id);
const cats = Object.keys(linhas.categorias);
const ESTADOS = new Set(Object.keys(linhas.estados));
const TEC = new Set(['HEV', 'PHEV', 'REEV', 'BEV']);

const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
if (dup.length) erros.push(`linhas.json: ids repetidos: ${dup.join(', ')}`);
linhas.linhas.forEach(l => { if (l.categoria && !cats.includes(l.categoria)) erros.push(`linhas.json: categoria desconhecida "${l.categoria}" em ${l.id}`); });

const arquivos = readdirSync('data/carros').filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)).sort();
const noManifest = [...manifest.carros].sort();
if (JSON.stringify(arquivos) !== JSON.stringify(noManifest))
  erros.push('manifest.json não bate com data/carros/ — rode: node scripts/build-manifest.mjs');

for (const id of arquivos) {
  const p = `data/carros/${id}.json`; let c;
  try { c = ler(p); } catch (e) { erros.push(`${p}: JSON inválido (${e.message})`); continue; }
  const e = m => erros.push(`${p}: ${m}`), a = m => avisos.push(`${p}: ${m}`);
  if (c.id !== id) e(`id "${c.id}" difere do nome do arquivo`);
  for (const k of ['nome', 'marca', 'tecnologia', 'carroceria', 'combustivel', 'preco', 'valores']) if (c[k] === undefined) e(`falta o campo "${k}"`);
  if (c.tecnologia && !TEC.has(c.tecnologia)) e(`tecnologia inválida "${c.tecnologia}"`);
  if (!c.preco || typeof c.preco.tabela !== 'number') e('preco.tabela precisa ser número');
  if (c.preco?.oferta !== undefined && typeof c.preco.oferta !== 'number') e('preco.oferta precisa ser número');
  (c.fontes || []).forEach(f => { if (!fontes[f]) e(`fonte "${f}" não existe em fontes.json`); });
  if (!c.fontes || !c.fontes.length) a('sem fontes registradas');
  const v = c.valores || {};
  for (const lid of ids) {
    if (!(lid in v)) { e(`falta o valor "${lid}"`); continue; }
    const x = v[lid];
    if (typeof x === 'string') continue; // estado ou texto informativo
    if (typeof x !== 'object' || x === null) { e(`valor "${lid}" com tipo inválido`); continue; }
    if (x.e !== undefined && !ESTADOS.has(x.e)) e(`estado inválido "${x.e}" em "${lid}"`);
    if (x.t !== undefined && typeof x.t !== 'string') e(`texto de "${lid}" precisa ser string`);
    (x.f || []).forEach(f => { if (!fontes[f]) e(`fonte "${f}" (em "${lid}") não existe`); });
  }
  for (const k of Object.keys(v)) if (!ids.includes(k)) a(`valor "${k}" não corresponde a nenhuma linha`);
}
avisos.forEach(m => console.warn('aviso:', m));
if (erros.length) { erros.forEach(m => console.error('erro:', m)); console.error(`\n${erros.length} erro(s).`); process.exit(1); }
console.log(`ok: ${arquivos.length} carros, ${ids.length} linhas, ${avisos.length} aviso(s).`);
