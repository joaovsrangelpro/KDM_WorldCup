import { useState } from 'react'
import { getAllTeams } from './services/worldCupApi'
import { drawGroups, validateGroups } from './simulation/groupDraw'

function App() {
  const [teams, setTeams] = useState([])
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLoadTeams() {
    try {
      setIsLoading(true)
      setError('')

      const teamsFromApi = await getAllTeams()
      const drawnGroups = drawGroups(teamsFromApi)
      const groupValidation = validateGroups(drawnGroups)
      const matches = generateAllGroupMatches(drawnGroups)

      console.log('Seleções retornadas pela API:', teamsFromApi)
      console.log('Grupos sorteados:', drawnGroups)
      console.log('Validação dos grupos:', groupValidation)

      setTeams(teamsFromApi)
      setGroups(drawnGroups)
      setGroupMatches(matches)

    } catch (err) {
      console.error(err)
      setError('Não foi possível buscar as seleções. Confira o console.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main>
      <section>
        <h1>KDM World Cup Simulator</h1>
        <p>Consumo da API e sorteio dos grupos da Copa.</p>

        <button type="button" onClick={handleLoadTeams} disabled={isLoading}>
          {isLoading ? 'Carregando...' : 'Buscar seleções e sortear grupos'}
        </button>

        {error && <p>{error}</p>}
      </section>

      <section>
        <h2>Seleções carregadas: {teams.length}</h2>

        {teams.length === 0 ? (
          <p>Nenhuma seleção carregada ainda.</p>
        ) : (
          <ul>
            {teams.map((team) => (
              <li key={team.token}>{team.nome}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Grupos sorteados</h2>

        {groups.length === 0 ? (
          <p>Nenhum grupo sorteado ainda.</p>
        ) : (
          <div>
            {groups.map((group) => (
              <article key={group.name}>
                <h3>Grupo {group.name}</h3>

                <ul>
                  {group.teams.map((team) => (
                    <li key={team.token}>{team.nome}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Partidas da fase de grupos</h2>

        {groupMatches.length === 0 ? (
          <p>Nenhuma partida gerada ainda.</p>
        ) : (
          <div>
            {groupMatches.map((groupMatch) => (
              <article key={groupMatch.groupName}>
                <h3>Grupo {groupMatch.groupName}</h3>

                {groupMatch.rounds.map((round) => (
                  <div key={`${groupMatch.groupName}-${round.round}`}>
                    <h4>Rodada {round.round}</h4>

                    <ul>
                      {round.matches.map((match) => (
                        <li key={`${match.team1.token}-${match.team2.token}`}>
                          {match.team1.nome} x {match.team2.nome}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default App
