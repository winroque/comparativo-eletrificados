// Gera data/export/comparativo.csv (um carro por linha, uma coluna por item).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const ler = p => JSON.parse(readFileSync(p, 'utf8'));
const linhas = ler('data/linhas.json').linhas.filter(l => l.id);
const { carros } = ler('data/manifest.json');
const NOME = { sim: 'sim', nao: 'não', nd: 'n/d', divulgado: 'divulgado', na: '—' };
const txt = v => {
  if (typeof v === 'string') return NOME[v] ?? v;
  const e = v.e ? NOME[v.e] : ''; return [e, v.t].filter(Boolean).join(': ');
};
const q = s => `"${String(s ?? '').replace(/"/g, '""')}"`;
const cab = ['id', 'nome', 'marca', 'tecnologia', 'carroceria', 'combustivel', 'status', 'preco_tabela', 'preco_oferta', 'oferta_nota', ...linhas.map(l => l.rotulo)];
const out = [cab.map(q).join(';')];
for (const id of carros) {
  const c = ler(`data/carros/${id}.json`);
  out.push([c.id, c.nome, c.marca, c.tecnologia, c.carroceria, c.combustivel, c.status, c.preco.tabela, c.preco.oferta ?? '', c.preco.oferta_nota ?? '',
    ...linhas.map(l => txt(c.valores[l.id]))].map(q).join(';'));
}
mkdirSync('data/export', { recursive: true });
writeFileSync('data/export/comparativo.csv', '\ufeff' + out.join('\n') + '\n');
console.log(`csv: ${carros.length} carros`);
