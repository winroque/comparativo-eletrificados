# Comparativo de eletrificados até R$ 260 mil

SUVs e sedãs híbridos, híbridos plug-in, REEV e elétricos vendidos no Brasil, comparados item por item. O site lê os dados de arquivos JSON neste repositório: cada carro tem o seu arquivo, e qualquer correção é um commit.

Dados consultados em 6 de outubro de 2026. Preços são de tabela pública ou oferta oficial; não são cotação de concessionária.

## Publicar no GitHub Pages

Com [git](https://git-scm.com) e a [CLI do GitHub](https://cli.github.com) instalados e logados (`gh auth login`), dentro desta pasta:

```bash
git init -b main
git add .
git commit -m "Primeira versão do comparativo"
gh repo create comparativo-eletrificados --public --source=. --push
gh api -X POST "repos/{owner}/comparativo-eletrificados/pages" -f build_type=workflow
```

O último comando liga o GitHub Pages no modo "GitHub Actions". A cada `push` na `main`, o workflow `.github/workflows/pages.yml` valida os dados, gera o CSV e publica. O endereço fica assim:

```
https://SEU-USUARIO.github.io/comparativo-eletrificados/
```

Sem a CLI: crie o repositório pelo site, envie os arquivos (inclusive a pasta `.github`) e, em **Settings → Pages → Build and deployment**, escolha **GitHub Actions**. No plano gratuito, o Pages exige repositório público.

## Rodar no computador

O site busca os JSON com `fetch`, então precisa de um servidor local (abrir o `index.html` direto não funciona):

```bash
npm run serve        # ou: python3 -m http.server 8000
```

Depois abra `http://localhost:8000`. Não há dependências para instalar; os scripts usam só Node 20+.

## Estrutura

```
index.html               página
assets/app.js            leitura dos dados, nota, filtros, ordenação e comparação
assets/style.css         visual (tema claro e escuro)
data/linhas.json         itens comparados, categorias, pesos padrão e teto de preço
data/carros/*.json       um arquivo por versão de carro
data/fontes.json         registro de fontes, referenciado pelos carros
data/manifest.json       lista de carros (gerada)
data/radar.json          modelos acompanhados, ainda fora da tabela
data/export/             CSV gerado
scripts/                 manifesto, validação e exportação
docs/                    revisão externa que originou a metodologia atual
```

## Como editar um carro

Abra `data/carros/<id>.json`. Cada item em `valores` aceita três formas:

| Forma | Exemplo | Uso |
|---|---|---|
| estado | `"sim"`, `"nao"`, `"nd"`, `"divulgado"`, `"na"` | equipamento presente, ausente, não confirmado, só divulgado pela imprensa, não se aplica |
| texto | `"197 cv"` | dado informativo (não pontua) |
| objeto | `{ "e": "sim", "t": "50 W ventilado", "f": ["byd-atto2-site"] }` | estado com detalhe e, opcionalmente, fonte da célula |

Regras:
- `"nao"` só quando o item está ausente da ficha oficial completa ou foi confirmado como inexistente. Ausência em material promocional é `"nd"`.
- `"divulgado"` é para dado de imprensa ou herdado de versão vizinha. Conta no máximo da nota, não no mínimo.
- A linha `ev` (autonomia elétrica) aceita só PBEV/Inmetro. WLTP, NEDC e CLTC vão em `evo`.
- Toda fonte citada precisa existir em `data/fontes.json`.

Para **adicionar um carro**, copie um arquivo parecido, troque `id` (igual ao nome do arquivo), nome, preço e valores, e rode:

```bash
npm run build    # gera o manifesto, valida e exporta o CSV
```

Se a validação falhar, ela diz o arquivo e o campo. O workflow `validar.yml` roda a mesma checagem em pull requests.

Para **mudar pesos, teto ou itens comparados**, edite `data/linhas.json`. Um item novo precisa de valor em todos os carros (a validação aponta os que faltam).

## Como a nota funciona

Quatro categorias pontuam: assistência e segurança, conforto, multimídia e conectividade, praticidade e recarga. Os pesos padrão (30, 30, 25 e 15) são escolha editorial e podem ser ajustados no site.

- **Mínimo:** só itens confirmados.
- **Máximo:** soma também os itens em aberto e os apenas divulgados.
- **Cobertura:** parte do peso cujo estado é conhecido. Abaixo de 90%, a posição do carro não é conclusiva.

Itens que não se aplicam ao tipo de carro (recarga DC num híbrido sem tomada, por exemplo) saem da conta. Preço, combustível, medidas, som e garantia são informativos. A nota não tem relação com a etiqueta do Inmetro.

## Limitações

- Oito carros ainda não têm fontes registradas por célula (o validador avisa quais).
- O Changan CS55 PHEV está em pré-venda sem ficha oficial; quase tudo está como "divulgado".
- Os modelos acrescentados em outubro (Jetour S06, Omoda 5 e 7, Jaecoo 5, Yaris Cross, EX5 elétrico, Omoda E5) têm muitos itens em aberto.
- A FIPE só está documentada para o EX5 EM-i Max.
