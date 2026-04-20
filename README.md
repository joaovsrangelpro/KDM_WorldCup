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

## Como rodar o projeto

Rode o servidor de desenvolvimento:

```bash
npm run dev
```

Depois acesse a URL exibida no terminal, normalmente:

```txt
http://localhost:5173
```

## API

Endpoint usado para carregar as seleções:

```txt
GET https://development-internship-api.geopostenergy.com/WorldCup/GetAllTeams
```

Header obrigatório:

```txt
git-user: seu_usuario_git
```
