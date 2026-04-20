# KDM World Cup Simulator

Simulador da Copa do Mundo desenvolvido para a avaliação do processo seletivo de Estágio em Desenvolvimento de Software 2026 da Katalyst Data Management.

## Tecnologias

- React
- Vite
- JavaScript
- CSS

## Funcionalidades implementadas

- Consumo da API oficial de seleções.
- Uso do header obrigatório `git-user`.
- Exibição das 32 seleções retornadas pela API.
- Sorteio randômico das seleções em 8 grupos com 4 times cada.
- Geração das partidas da fase de grupos em 3 rodadas por grupo.
- Simulação dos resultados da fase de grupos.
- Cálculo da classificação por pontos, saldo de gols e sorteio em caso de empate.
- Classificação dos dois primeiros colocados de cada grupo para as oitavas.
- Geração e simulação do mata-mata: oitavas, quartas, semifinais e final.
- Simulação de disputa de pênaltis em empates no mata-mata.
- Exibição do campeão.
- Envio do resultado final para a API.

## Como rodar o projeto

Rode o servidor de desenvolvimento:

```bash
npm run dev
```

Depois acesse a URL exibida no terminal, normalmente:

```txt
http://localhost:5173
```

Na tela, clique em **Buscar seleções e sortear grupos** para executar a simulação completa. Ao final, use o botão **Enviar resultado final** para registrar o campeão na API.

## API

Endpoints usados:

```txt
GET https://development-internship-api.geopostenergy.com/WorldCup/GetAllTeams
POST https://development-internship-api.geopostenergy.com/WorldCup/FinalResult
```

Header obrigatório:

```txt
git-user: seu_usuario_git
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
