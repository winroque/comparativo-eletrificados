# Conferência de fontes — 6 de outubro de 2026

Os oito carros que estavam sem fontes foram conferidos contra documentos oficiais: ficha, página ou lista de preços do fabricante e a tabela PBE Veicular 2026 do Inmetro. Sete passaram a ter fontes registradas.

**Aplicado em 07/10/2026:** todas as divergências e todos os "preencher" das tabelas abaixo foram aplicados, inclusive os itens ausentes da ficha completa do Song Pro, que viraram `nao`. Os itens "sem confirmação" continuam como estavam. O Song Plus GS ficou com ressalva e o Song Plus 1.5T DM-i entrou na tabela (última seção).

Legenda das propostas: **divergência** é um valor do arquivo diferente da fonte; **preencher** é uma célula "n/d" que a fonte resolve; **sem confirmação** é um valor do arquivo que a fonte não traz (não é erro, mas continua sem fonte).

## BYD Song Pro GS

Fontes: `byd-songpro-flex-ficha` (rev. 3, 05/08/2026), `byd-songpro-flex-site`, `inmetro-pbev-2026` (linha "SONG PRO GS DM FLEX").

Confirmados: flex, 219 cv, 300 Nm, 18,3 kWh, 72 km PBEV, 1.105 km NEDC na gasolina, só AC 6,6 kW, V2L, 4,74 m, 2,71 m, câmera 360°, central 12,8″, painel 8,8″, OTA, indução 50 W ventilada, teto panorâmico, bancos dianteiros elétricos, duas zonas, sensor de chuva, ACC, AEB, BSD, LKA, RCTB, DOW, garantia 6/8 anos.

| Item | Arquivo | Fonte | Tipo |
|---|---|---|---|
| Porta-malas | 520 L | **530 L** (ficha e página) | divergência |
| 0–100 km/h | 8,6–8,8 s | **8,8 s** na GS (8,6 s é a GL) | divergência |
| Estepe | n/d | kit de reparo | preencher (`nao: kit`) |
| Tampa traseira elétrica | n/d | abertura e fechamento elétricos | preencher (`sim`) |
| Som | n/d | 8 alto-falantes | preencher |
| CarPlay/Android Auto sem fio | sim | ficha diz só "conexão Apple CarPlay e Android Auto" | sem confirmação |
| Chave digital (NFC) | sim | ficha lista só chave presencial | sem confirmação |
| Google integrado, app | sim | não constam na ficha | sem confirmação |
| Memória, ventilação, aquecimento, luz ambiente, DMS | n/d | ausentes da ficha completa | poderiam virar `nao` pela regra do README |

## CAOA Chery Tiggo 7 Pro PHEV

Fontes: `caoachery-tiggo7phev-ficha` (PDF de 29/05/2026), `caoachery-tiggo7phev-site` (R$ 209.990), `caoachery-garantia`, `inmetro-pbev-2026` (linha com 68 km e 38,6/30,3 km/l, a mesma da ficha).

Confirmados: preço, gasolina, 279 cv, 37,2 kgfm (365 Nm), 18,4 kWh, 68 km PBEV, V2L 220 V, 4,55 m, 2,67 m, 484 L, câmera 540°, tela curva 24,6″, HUD, Sony 8 alto-falantes, indução 50 W, teto panorâmico, bancos elétricos com ventilação e aquecimento, duas zonas, luz ambiente, sensor de chuva, ACC, AEB, assistência de faixa, garantia 7 anos (84 meses) e 8 anos no sistema elétrico de tração (96 meses).

| Item | Arquivo | Fonte | Tipo |
|---|---|---|---|
| 0–100 km/h | n/d | 7,8 s | preencher |
| Estepe | n/d | kit de reparo | preencher (`nao: kit`) |
| Memória do banco | n/d | banco do motorista com memória | preencher (`sim`) |
| Ponto cego (BSD) | n/d | presente | preencher (`sim`) |
| Tráfego cruzado com frenagem (RCTB) | n/d | presente | preencher (`sim`) |
| Alerta de porta (DOW) | n/d | presente | preencher (`sim`) |
| Recarga DC | sim: 30–80% em 20 min | a ficha não menciona recarga DC | sem confirmação |
| Tampa traseira elétrica | sim | ficha diz "abertura do porta-malas por sensor de aproximação", sem fechamento motorizado | sem confirmação |
| CarPlay/Android Auto sem fio | sim | não consta na ficha | sem confirmação |
| Autonomia total | 1.200+ km | não consta | sem confirmação |

## Jaecoo 7 Elite, Luxury e Prestige

Fontes: `jaecoo7-site` (lista de itens e preço de cada versão; a página não tem ficha técnica em PDF) e, para Luxury e Prestige, `inmetro-pbev-2026` (79 km). A Elite não aparece na tabela PBEV de janeiro.

Confirmados nas três: preços (R$ 189.990, R$ 234.990 e R$ 256.990), 79 km de autonomia elétrica, 1.200 km combinados, tampa traseira elétrica com sensor, indução refrigerada, painel digital, luz ambiente, ACC e AEB. Por versão: Luxury e Prestige com câmera 540°, teto panorâmico, ventilação, OTA e app; Prestige com central 14,8″, HUD, Sony 8 alto-falantes, aquecimento, memória, projeção nas portas, BSD, RCTB, DOW, DMS e ELK.

| Item | Arquivo | Fonte | Tipo |
|---|---|---|---|
| Elite: bancos do motorista e do passageiro elétricos | nao / nao | "Bancos dianteiros elétricos" na lista da Elite | divergência |
| Elite: ar de duas zonas | n/d | "Dual Zone" | preencher (`sim`) |
| Elite e Luxury: som | n/d: comum | 6 alto-falantes | preencher |
| Bateria | 18,3 kWh | a página diz 18,4 kWh na lista e 18,3 kWh no texto do sistema | inconsistência da própria fonte |
| Potência combinada | 279 cv | a página só dá 135 cv (combustão) e 204 cv (elétrico) | sem confirmação |
| Recarga DC 40 kW, 4,50 m, 2,67 m, estepe, sensor de chuva | — | não constam na página | sem confirmação |
| Elite: autonomia elétrica | 79 km | página diz 79 km, mas a Elite não está no PBEV de janeiro | sem confirmação PBEV |

## Toyota Corolla Altis Premium Hybrid

Fontes: `toyota-corolla-hybrid-site`, `toyota-corolla-hybrid-ficha` (2026), `toyota-corolla-catalogo-my25` (lista de equipamentos por versão), `toyota-precos-2026-10`.

Confirmados: flex, 122 cv combinados, 4,63 m, 2,70 m, 470 L, painel 12,3″, duas zonas, Serviços Conectados (app), ACC, pré-colisão, assistente de faixa, ponto cego e alerta de tráfego cruzado (sem frenagem, como já está). A garantia "5 anos (até 10)" não foi conferida nas fontes do sedã; a página fala em "garantia de até 10 anos". O PBEV 2026 não traz autonomia elétrica, coerente com híbrido sem tomada.

| Item | Arquivo | Fonte | Tipo |
|---|---|---|---|
| Preço | R$ 210.090 | **R$ 211.990** (lista de outubro e página) | divergência |
| Estepe | n/d | temporário 205/55 R16 | preencher (`sim`) |
| Câmera 360° | n/d | visão panorâmica 360° (PVM) | preencher (`sim`) |
| CarPlay/Android Auto sem fio | n/d | sem fio | preencher (`sim`) |
| Central | sim | 10″ | preencher o texto |
| Indução | n/d | presente | preencher (`sim`) |
| Teto | n/d | teto solar elétrico comum | preencher (`nao: teto solar comum`) |
| Banco do motorista / passageiro | n/d / n/d | elétrico 8 ajustes / manual | preencher (`sim` / `nao`) |
| Sensor de chuva | n/d | presente | preencher (`sim`) |
| Som | n/d | 4 alto-falantes e 2 tweeters | preencher |

A lista de equipamentos é do catálogo MY'25; a página e a ficha de 2026 confirmam os itens que mencionam.

## Toyota Corolla Cross XRX Hybrid

Fontes: `toyota-corolla-cross-catalogo` (MY26, junho/2026), `toyota-precos-2026-10` (R$ 223.790).

Confirmados: preço, flex, 4,46 m, 2,64 m, estepe temporário, tampa elétrica com sensor, câmera 360°, CarPlay/Android Auto sem fio, indução, teto solar comum, banco do motorista elétrico e do passageiro manual, duas zonas, ACC, pré-colisão, ponto cego, assistente de faixa (LTA), Serviços Conectados, garantia de 5 anos e 8 anos no sistema híbrido.

| Item | Arquivo | Fonte | Tipo |
|---|---|---|---|
| Painel de instrumentos | 7″ | **12,3″** (TFT digital) | divergência |
| Luz ambiente | nao | **"Iluminação ambiente+"** | divergência |
| Central | 10,1″ | 10″ no catálogo | divergência pequena |
| Porta-malas | n/d | 440 L | preencher |
| Sensor de chuva | n/d | presente | preencher (`sim`) |
| Som | n/d: comum | 4 alto-falantes e 2 tweeters | preencher |
| Potência combinada | 122 cv | catálogo dá 101 cv + 72 cv, sem número combinado | sem confirmação no catálogo (a Toyota usa 122 cv para o mesmo conjunto no Corolla) |

## BYD Song Plus GS — sem fonte registrada

O arquivo descreve o Song Plus GS DM: 235 cv, bateria de 18,3 kWh e 63 km. O PBEV 2026 ainda traz essa versão com 63 km. Mas o site da BYD hoje só oferece o **Song Plus 1.5T DM-i** (ficha revisada em 09/07/2026: 240 cv, 300 Nm, 26,6 kWh, 99 km PBEV, DC 18 kW, 552 L, 4,78 m), além do Song Premium AWD. Não encontrei fonte oficial atual para o preço de R$ 249.990 nem para os itens do GS.

**Decisão aplicada em 07/10/2026:** o GS continua na tabela com status "versão anterior", observação explicando a ressalva e o PBEV 2026 como única fonte (confirma os 63 km). Entrou o **BYD Song Plus 1.5T DM-i** (`byd-song-plus-15t`), preenchido pela ficha de 09/07/2026, pela página do modelo e pela página de ofertas da BYD, que mostra **R$ 249.990** (validade até 31/10/2026, condição de taxa 0% ou bônus no usado, sem desconto no preço). Esse é o mesmo preço que estava no GS: era o preço do modelo atual.

No 1.5T ficaram em aberto: fabricação, Google integrado, app, sensor de chuva, chave NFC (a ficha lista só chave presencial), espelhamento sem fio (a ficha não diz) e aquecimento dos bancos (a página cita, a ficha não). A ficha não lista memória do banco nem monitor de fadiga, por isso `nao`. A autonomia de 99 km é a que a BYD declara como PBEV; o modelo ainda não aparece na tabela do Inmetro de janeiro.
