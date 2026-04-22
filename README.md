# KDM World Cup Simulator

Simulador da Copa do Mundo desenvolvido para a avaliação do processo seletivo de
Estágio em Desenvolvimento de Software 2026 da Katalyst Data Management.

O projeto consome a API fornecida pela avaliação, sorteia as 32 seleções em grupos,
simula a fase de grupos, monta o mata-mata, resolve empates eliminatórios por
pênaltis e permite enviar o resultado da final para a API.

## Tecnologias

- React
- React DOM
- Vite
- JavaScript
- CSS
- react-world-flags

O uso de frameworks e bibliotecas é permitido pelas instruções da avaliação.

Dependências diretas do app:

- `react`
- `react-dom`
- `react-world-flags`

Ferramentas de desenvolvimento declaradas no projeto:

- `vite`
- `@vitejs/plugin-react`
- `eslint`
- `@eslint/js`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `globals`
- `@types/react`
- `@types/react-dom`

## Status dos requisitos

Com base no PDF de instruções da prova, os requisitos funcionais solicitados estão
cobertos pela aplicação:

| Requisito da avaliação | Status | Implementação |
| --- | --- | --- |
| Consumir a API com as 32 seleções | OK | `src/services/worldCupApi.js` usa `GET /WorldCup/GetAllTeams` |
| Enviar o header obrigatório `git-user` | OK | Header configurado como `git-user: joaovsrangelpro` |
| Separar as seleções aleatoriamente em 8 grupos de 4 | OK | `drawGroups` usa embaralhamento Fisher-Yates |
| Exibir a formação dos grupos na tela | OK | Tela `Visão geral`, seção `Grupos sorteados` |
| Gerar 3 rodadas por grupo, com 2 jogos por rodada | OK | `generateGroupMatches` cria 6 partidas por grupo |
| Simular e exibir os resultados da fase de grupos | OK | `simulateGroupMatches` e tela `Partidas da fase de grupos` |
| Contabilizar vitória com 3 pontos e empate com 1 ponto | OK | `applyMatchToStandings` |
| Classificar os dois primeiros de cada grupo | OK | `calculateGroupStandings` retorna `qualifiedTeams` |
| Aplicar desempate por pontos, saldo de gols e sorteio | OK | Ordenação por pontos, saldo e `drawOrder` randômico |
| Gerar oitavas, quartas, semifinais e final | OK | `generateRoundOf16` e `generateNextKnockoutRound` |
| Resolver empates no mata-mata com pênaltis | OK | `simulateKnockoutMatches` chama `simulatePenalties` em caso de empate |
| Exibir chaveamento e campeão | OK | `src/components/BracketView.jsx` |
| Enviar resultado final para a API | OK | `POST /WorldCup/FinalResult` via botão `Enviar resultado final` |

Além do escopo obrigatório, a aplicação também simula e exibe a disputa de terceiro
lugar como complemento visual.

## Visualização recomendada

Para a melhor experiência visual, recomenda-se abrir o projeto em desktop com
resolução de 1920x1080.

Essa recomendação existe porque o chaveamento completo exibe muitas informações ao
mesmo tempo: oitavas dos dois lados, quartas, semifinais, final, terceiro lugar,
linhas de conexão, bandeiras, placares e placares de pênaltis. A composição foi
otimizada para mostrar todo esse bracket em uma única tela ampla, com leitura clara
e sem comprometer a simetria entre esquerda e direita.

## Como rodar

Instale as dependências:

```bash
npm install
```

Esse comando instala todas as dependências declaradas no `package.json`, incluindo
React, React DOM, Vite, ESLint e `react-world-flags`. Não é necessário baixar
bibliotecas separadamente.

Rode o servidor de desenvolvimento:

```bash
npm run dev
```

Depois acesse a URL exibida no terminal, normalmente:

```txt
http://localhost:5173
```

Na tela inicial, clique em **Buscar seleções e sortear grupos**. Esse botão executa
o fluxo completo da simulação: busca das seleções, sorteio, fase de grupos,
classificação, mata-mata, terceiro lugar e final.

Depois da simulação, use as abas **Visão geral** e **Chaveamento** para alternar
entre a listagem detalhada e o bracket visual. O botão **Enviar resultado final**
registra o campeão na API.

## API

Endpoints usados:

```txt
GET https://development-internship-api.geopostenergy.com/WorldCup/GetAllTeams
POST https://development-internship-api.geopostenergy.com/WorldCup/FinalResult
```

Header obrigatório enviado em todas as chamadas:

```txt
git-user: joaovsrangelpro
```

Formato enviado no resultado final:

```json
{
  "equipeA": "token-da-equipe-a",
  "equipeB": "token-da-equipe-b",
  "golsEquipeA": 1,
  "golsEquipeB": 1,
  "golsPenaltyTimeA": 4,
  "golsPenaltyTimeB": 3
}
```

Quando a final não vai para os pênaltis, os campos `golsPenaltyTimeA` e
`golsPenaltyTimeB` são enviados com valor `0`, conforme permitido nas instruções.

## Organização do código

- `src/services/worldCupApi.js`: chamadas para a API da avaliação.
- `src/simulation/groupDraw.js`: sorteio e validação dos grupos.
- `src/simulation/groupStage.js`: geração de rodadas, simulação e classificação.
- `src/simulation/knockoutStage.js`: oitavas, fases seguintes, pênaltis e terceiro lugar.
- `src/components/BracketView.jsx`: visualização do chaveamento.
- `src/data/teamCodes.js`: conversão dos nomes das seleções para códigos curtos exibidos no bracket.
- `src/data/teamFlagCodes.js`: mapeamento dos códigos das seleções para os códigos de bandeiras usados pelo `react-world-flags`.
- `src/App.jsx`: orquestração do fluxo da simulação e envio do resultado final.
- `src/index.css`: estilos globais, visão geral e chaveamento.

## Validações realizadas

Foram executadas validações locais para conferir a saúde do projeto e as invariantes
principais da simulação:

```bash
npm run lint
npm run build
npm run validate:simulation
```

O comando `npm run validate:simulation` executa `scripts/validateSimulation.js`
com 32 seleções fictícias e confirma as principais invariantes da regra de negócio:
8 grupos, 4 seleções por grupo, 3 rodadas, 6 partidas por grupo, 16 classificados,
mata-mata completo, final com campeão, terceiro lugar e resolução de empate por
pênaltis.
