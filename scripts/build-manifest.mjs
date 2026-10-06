// Regenera data/manifest.json a partir dos arquivos em data/carros/.
// A data "gerado" só muda quando a lista de carros muda; assim o arquivo é estável e o validar.yml não falha à toa.
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
const carros = readdirSync('data/carros').filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)).sort();
const atual = existsSync('data/manifest.json') ? JSON.parse(readFileSync('data/manifest.json', 'utf8')) : {};
const igual = JSON.stringify(atual.carros) === JSON.stringify(carros);
const gerado = igual && atual.gerado ? atual.gerado : new Date().toISOString().slice(0, 10);
writeFileSync('data/manifest.json', JSON.stringify({ gerado, carros }, null, 2) + '\n');
console.log(`manifest: ${carros.length} carros`);
