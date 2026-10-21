// Atualiza a linha FIPE (usado × 0 km) dos carros listados em data/fipe.json, pela API pública Parallelum.
// Uso: node scripts/update-fipe.mjs   (opcional: FIPE_TOKEN para limite maior na API)
// Só toca na célula "fipe" de cada carro e no rótulo da linha; um carro que falhar mantém o valor anterior.
import { readFileSync, writeFileSync } from 'node:fs';
const ler = p => JSON.parse(readFileSync(p, 'utf8'));
const gravar = (p, o) => writeFileSync(p, JSON.stringify(o, null, 2) + '\n');
const API = 'https://fipe.parallelum.com.br/api/v2';
const FONTE = 'fipe-tabela';
const espera = ms => new Promise(r => setTimeout(r, ms));
const headers = { 'user-agent': 'comparativo-eletrificados', ...(process.env.FIPE_TOKEN ? { 'X-Subscription-Token': process.env.FIPE_TOKEN } : {}) };
async function get(caminho) {
  for (let t = 1; t <= 3; t++) {
    const r = await fetch(API + caminho, { headers }).catch(e => ({ ok: false, status: e.message }));
    if (r.ok) { await espera(400); return r.json(); }
    if (t < 3) await espera(2000 * t); else throw new Error(`${caminho}: ${r.status}`);
  }
}
const valor = s => Number(String(s).replace(/[^\d,]/g, '').replace(',', '.'));
const mil = n => 'R$ ' + (n / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' mil';
const MES = { janeiro: 'jan', fevereiro: 'fev', 'março': 'mar', abril: 'abr', maio: 'mai', junho: 'jun', julho: 'jul', agosto: 'ago', setembro: 'set', outubro: 'out', novembro: 'nov', dezembro: 'dez' };

const { carros } = ler('data/fipe.json');
let referencia = '', ok = 0, falhas = 0;
for (const [id, { codigo, ano }] of Object.entries(carros)) {
  const p = `data/carros/${id}.json`;
  try {
    const c = ler(p);
    const anos = await get(`/cars/${codigo}/years`);
    const zero = anos.find(a => a.code.startsWith('32000-'));
    const usados = anos.filter(a => !a.code.startsWith('32000-')).sort((a, b) => parseInt(b.code) - parseInt(a.code));
    const usado = usados.find(a => parseInt(a.code) === ano) || usados[0];
    if (!zero || !usado) throw new Error('sem 0 km ou sem ano usado');
    const pz = await get(`/cars/${codigo}/years/${zero.code}`), pu = await get(`/cars/${codigo}/years/${usado.code}`);
    const vz = valor(pz.price), vu = valor(pu.price);
    referencia = pz.referenceMonth || referencia;
    const dif = Math.round((vu / vz - 1) * 100);
    c.valores.fipe = { t: `${mil(vu)} (${parseInt(usado.code)}) × ${mil(vz)} (0 km), ${dif > 0 ? '+' : '−'}${Math.abs(dif)}%`, f: [FONTE] };
    if (!c.fontes.includes(FONTE)) c.fontes.push(FONTE);
    gravar(p, c); ok++;
    console.log(`${id}: ${c.valores.fipe.t}`);
  } catch (e) { falhas++; console.warn(`aviso: ${id} (${codigo}) não atualizado: ${e.message}`); }
}
if (!ok) { console.error('erro: nenhum carro atualizado'); process.exit(1); }

// rótulo da linha com o mês de referência, por exemplo "FIPE out/26: usado × 0 km"
const [mes, , aaaa] = referencia.split(' ');
if (MES[mes]) {
  const linhas = ler('data/linhas.json');
  linhas.linhas.find(l => l.id === 'fipe').rotulo = `FIPE ${MES[mes]}/${aaaa.slice(2)}: usado × 0 km`;
  gravar('data/linhas.json', linhas);
}
const fontes = ler('data/fontes.json');
fontes[FONTE] = { titulo: `Tabela FIPE, preço médio de ${referencia} (consulta automática pela API Parallelum)`, url: 'https://veiculos.fipe.org.br/', tipo: 'referência' };
gravar('data/fontes.json', fontes);
console.log(`fipe: ${ok} carros atualizados, ${falhas} falha(s), referência ${referencia}`);
