# Histórico

## 2026-10-07 — Yaris Cross conferido
- Toyota Yaris Cross XRX Hybrid pelo catálogo MY'26: ACC, frenagem autônoma, assistente de faixa, estepe temporário e som 4+2; bancos manuais, ar de uma zona e sem sensor de chuva, NFC, OTA, alerta de porta e monitor de fadiga; tráfego cruzado só com alerta. Cobertura de 41% para 100%.

## 2026-10-07 — Omoda 7, Omoda E5, EX5 elétrico e Jetour S06 conferidos
- EX5 elétrico Pro e Max pela ficha completa da Geely: câmera 540°, V2L, kit de reparo, OTA e app, garantia 6/8 anos; o Pro não tem ACC, frenagem autônoma, ponto cego, faixa, tampa elétrica, banco do passageiro elétrico nem luz ambiente. Ar de duas zonas passa a "n/d" (a ficha só diz automático).
- Jetour S06 Premium pela ficha completa: 0–100 em 7,8 s, painel 9,2″, Sony 9 alto-falantes, banco do passageiro elétrico, frenagem autônoma, faixa e alerta de porta; os 510 Nm eram soma dos motores e saíram.
- Omoda 7 Luxury e Omoda E5 pelas fichas simplificadas: entre-eixos, torque, câmera, som, teto, bancos, duas zonas e luz ambiente; porta-malas do E5 corrigido para 340 L.
- Autonomias dos cinco ligadas à tabela PBEV 2026.

## 2026-10-07 — Jaecoo 7 e Omoda 5 conferidos
- Jaecoo 7: porta-malas 500 L e kit de reparo pela ficha de maio/2025; Elite e Luxury sem o pacote ADAS 2.5 (ponto cego, RCTB, alerta de porta, permanência em faixa) e sem memória do banco; CarPlay/Android Auto sem fio na Luxury e Prestige. Os 339 cv e 510 Nm "combinados" da ficha são soma dos motores e não foram usados.
- Omoda 5 SHS-H Prestige pela ficha simplificada oficial: 4,45 m, 2,61 m, 372 L, 1,83 kWh, câmera 360°, Sony 8 alto-falantes, indução 50 W, teto solar comum, garantia 7/8 anos e outros itens.
- A ficha de Jaecoo 5 recebida é do mercado mexicano (1.5T a gasolina) e não foi usada.

## 2026-10-07 — Civic e C10 conferidos
- Honda Civic Advanced Hybrid conferido pelo catálogo digital oficial: estepe temporário, sensor de chuva, sensores de estacionamento dianteiros e traseiros, comprimento 4,69 m, garantia; itens ausentes da ficha completa viram "não".
- Leapmotor C10 REEV conferido pela ficha técnica (enviada pelo usuário) e pelos itens de série do configurador oficial: só sensores traseiros, kit de reparo, duas zonas e sensor de chuva.

## 2026-10-07 — CS55 PHEV e auxiliares de estacionamento
- Changan CS55 PHEV atualizado pela ficha oficial (10/09/2026), com manual e certificado de garantia: itens antes "divulgado" passam a confirmados; recarga DC confirmada no manual, sem potência informada.
- Novo item "Auxiliares de estacionamento" (praticidade): sim com sensores dianteiros e traseiros, não só com traseiros. Preenchido nos 28 carros com fonte oficial, exceto Civic, C10, Jaecoo 5 e Song Plus GS.
- `docs/fichas-oficiais.md` lista página e ficha de cada carro.

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
