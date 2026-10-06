// Regenera data/manifest.json a partir dos arquivos em data/carros/.
import { readdirSync, writeFileSync } from 'node:fs';
const carros = readdirSync('data/carros').filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)).sort();
const hoje = new Date().toISOString().slice(0, 10);
writeFileSync('data/manifest.json', JSON.stringify({ gerado: hoje, carros }, null, 2) + '\n');
console.log(`manifest: ${carros.length} carros`);
