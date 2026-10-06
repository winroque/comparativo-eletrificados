// Junta linhas, fontes, radar e todos os carros em data/dados.json, o único arquivo que o site baixa.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const ler = p => JSON.parse(readFileSync(p, 'utf8'));
const { carros } = ler('data/manifest.json');
const dados = {
  linhas: ler('data/linhas.json'),
  fontes: ler('data/fontes.json'),
  radar: existsSync('data/radar.json') ? ler('data/radar.json') : [],
  carros: carros.map(id => ler(`data/carros/${id}.json`)),
};
writeFileSync('data/dados.json', JSON.stringify(dados, null, 2) + '\n');
console.log(`dados: ${carros.length} carros`);
