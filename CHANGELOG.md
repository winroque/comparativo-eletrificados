# Histórico

## 2026-10-07 — conferência aplicada
- Aplicadas as correções e os preenchimentos de `docs/conferencia-fontes-2026-10-06.md` em Song Pro GS, Tiggo 7 Pro PHEV, Jaecoo 7 Elite e Luxury, Corolla Altis Premium Hybrid (preço R$ 211.990) e Corolla Cross XRX Hybrid.
- Entrou o BYD Song Plus 1.5T DM-i (R$ 249.990). O Song Plus GS fica como "versão anterior", com ressalva. Total: 28 versões.

## 2026-10-06 — fontes dos carros sem registro
- Fontes oficiais registradas para Song Pro GS, Tiggo 7 Pro PHEV, Jaecoo 7 Elite, Luxury e Prestige, Corolla Altis Premium Hybrid e Corolla Cross XRX Hybrid, incluindo a tabela PBE Veicular 2026 nas autonomias elétricas que ela confirma. Nenhum valor mudou.
- Divergências e lacunas encontradas estão em `docs/conferencia-fontes-2026-10-06.md`. O Song Plus GS continua sem fonte: a versão não aparece mais no site da BYD.

## 2026-10-06 — arquivo único para o site
- O site passa a baixar só `data/dados.json`, gerado pelo `npm run build` a partir dos JSON de cada carro (1 requisição em vez de 31). A edição continua nos arquivos de `data/carros/`.
- A data do `manifest.json` só muda quando a lista de carros muda; antes, o `validar.yml` falhava em qualquer dia depois do último build.

## 2026-10-06 — banco SQLite
- Exportação dos dados em `data/export/comparativo.sqlite` (`npm run sqlite`), com uma tabela por tipo de dado e a visão `v_valores`.

## 2026-10-06 — repositório
- Dados separados em um JSON por carro, com registro de fontes e validação automática.
- Entraram EX5 EM-i Pro, Jetour S06 Premium, Omoda 7 SHS-P Luxury, Omoda 5 SHS-H Prestige, Jaecoo 5 SHS-H Prestige, Toyota Yaris Cross XRX Hybrid, Geely EX5 Pro e Max (elétricos) e Omoda E5. Total: 27 versões.
- Exportação em CSV e publicação via GitHub Pages.

## 2026-10-06 — revisão metodológica
- Nota em faixa (mínimo, máximo e cobertura) com pesos ajustáveis; itens não aplicáveis saem da conta.
- Correções: Haval H6 linha 2027 flex (HEV2 248 cv; PHEV19 77 km pelo Inmetro), C10 REEV 111 km pelo Inmetro, Atto 2 com chave NFC, EX5 EM-i Max a R$ 219.990, King GS, Ora 5, Civic.
- CS55 PHEV: equipamentos herdados da versão Infinity passaram a "divulgado".
- Teto solar comum deixou de contar como panorâmico; OTA e app separados; ventilação por assento.
- EX5 EM-i Ultra incluído.
