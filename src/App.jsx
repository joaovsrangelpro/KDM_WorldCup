import { useState } from 'react'
import { getAllTeams } from './services/worldCupApi'
import { drawGroups, 
  validateGroups 
} from './simulation/groupDraw'
import {
  calculateGroupStandings,
  generateAllGroupMatches,
  simulateGroupMatches,
} from './simulation/groupStage'
import {
  generateNextKnockoutRound,
  generateRoundOf16,
  simulateKnockoutMatches,
} from './simulation/knockoutStage'

function App() {
  const [teams, setTeams] = useState([])
  const [groups, setGroups] = useState([])
  const [groupMatches, setGroupMatches] = useState([])
  const [groupStandings, setGroupStandings] = useState([])
  const [roundOf16, setRoundOf16] = useState([])
  const [quarterFinals, setQuarterFinals] = useState([])
  const [semifinals, setSemifinals] = useState([])
  const [finalMatch, setFinalMatch] = useState([])
  const [champion, setChampion] = useState(null)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLoadTeams() {
    try {
      setIsLoading(true)
      setError('')

      const teamsFromApi = await getAllTeams()
      const drawnGroups = drawGroups(teamsFromApi)
      const groupValidation = validateGroups(drawnGroups)
      const generatedGroupMatches = generateAllGroupMatches(drawnGroups)
      const simulatedGroupMatches = simulateGroupMatches(generatedGroupMatches)
      const calculatedGroupStandings = calculateGroupStandings(simulatedGroupMatches)

      const roundOf16Matches = generateRoundOf16(calculatedGroupStandings)
      const simulatedRoundOf16Matches = simulateKnockoutMatches(roundOf16Matches)

      const quarterFinalMatches = generateNextKnockoutRound(simulatedRoundOf16Matches)
      const simulatedQuarterFinalMatches = simulateKnockoutMatches(quarterFinalMatches)

      const semifinalMatches = generateNextKnockoutRound(simulatedQuarterFinalMatches)
      const simulatedSemifinalMatches = simulateKnockoutMatches(semifinalMatches)

      const finalMatches = generateNextKnockoutRound(simulatedSemifinalMatches)
      const simulatedFinalMatches = simulateKnockoutMatches(finalMatches)

      const tournamentChampion = simulatedFinalMatches[0].winner

      console.log('Seleções retornadas pela API:', teamsFromApi)
      console.log('Grupos sorteados:', drawnGroups)
      console.log('Validação dos grupos:', groupValidation)
      console.log('Partidas simuladas da fase de grupos:', simulatedGroupMatches)
      console.log('Classificação dos grupos:', calculatedGroupStandings)
      console.log('Oitavas de final:', simulatedRoundOf16Matches)
      console.log('Quartas de final:', simulatedQuarterFinalMatches)

      setTeams(teamsFromApi)
      setGroups(drawnGroups)
      setGroupMatches(simulatedGroupMatches)
      setGroupStandings(calculatedGroupStandings)
      
      setRoundOf16(simulatedRoundOf16Matches)
      setQuarterFinals(simulatedQuarterFinalMatches)
      setSemifinals(simulatedSemifinalMatches)
      setFinalMatch(simulatedFinalMatches)
      setChampion(tournamentChampion)

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
                        {match.team1.nome} {match.team1Score} x {match.team2Score} {match.team2.nome}
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

      <section>
        <h2>Classificação dos grupos</h2>

        {groupStandings.length === 0 ? (
          <p>Nenhuma classificação calculada ainda.</p>
        ) : (
          <div>
            {groupStandings.map((groupStanding) => (
              <article key={groupStanding.groupName}>
                <h3>Grupo {groupStanding.groupName}</h3>

                <table>
                  <thead>
                    <tr>
                      <th>Posição</th>
                      <th>Seleção</th>
                      <th>Pontos</th>
                      <th>Jogos</th>
                      <th>Vitórias</th>
                      <th>Empates</th>
                      <th>Derrotas</th>
                      <th>GP</th>
                      <th>GC</th>
                      <th>Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupStanding.table.map((standing, index) => (
                      <tr key={standing.team.token}>
                        <td>{index + 1}</td>
                        <td>{standing.team.nome}</td>
                        <td>{standing.points}</td>
                        <td>{standing.games}</td>
                        <td>{standing.wins}</td>
                        <td>{standing.draws}</td>
                        <td>{standing.losses}</td>
                        <td>{standing.goalsFor}</td>
                        <td>{standing.goalsAgainst}</td>
                        <td>{standing.goalDifference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Oitavas de final</h2>

        {roundOf16.length === 0 ? (
          <p>Nenhum confronto definido ainda.</p>
        ) : (
          <ul>
            {roundOf16.map((match) => (
              <li key={match.match}>
                Jogo {match.match}: {match.team1.nome} {match.team1Score} x {match.team2Score} {match.team2.nome}
                {match.team1Penalties > 0 || match.team2Penalties > 0 ? (
                  <span>
                    {' '}
                    ({match.team1Penalties} x {match.team2Penalties} nos pênaltis)
                  </span>
                ) : null}
                <strong> - Vencedor: {match.winner.nome}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Quartas de final</h2>

        {quarterFinals.length === 0 ? (
          <p>Nenhum confronto definido ainda.</p>
        ) : (
          <ul>
            {quarterFinals.map((match) => (
              <li key={match.match}>
                Jogo {match.match}: {match.team1.nome} {match.team1Score} x {match.team2Score} {match.team2.nome}
                {match.team1Penalties > 0 || match.team2Penalties > 0 ? (
                  <span>
                    {' '}
                    ({match.team1Penalties} x {match.team2Penalties} nos pênaltis)
                  </span>
                ) : null}
                <strong> - Vencedor: {match.winner.nome}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Semifinais</h2>

        {semifinals.length === 0 ? (
          <p>Nenhum confronto definido ainda.</p>
        ) : (
          <ul>
            {semifinals.map((match) => (
              <li key={match.match}>
                Jogo {match.match}: {match.team1.nome} {match.team1Score} x{' '}
                {match.team2Score} {match.team2.nome}
                {match.team1Penalties > 0 || match.team2Penalties > 0 ? (
                  <span>
                    {' '}
                    ({match.team1Penalties} x {match.team2Penalties} nos pênaltis)
                  </span>
                ) : null}
                <strong> - Vencedor: {match.winner.nome}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Final</h2>

        {finalMatch.length === 0 ? (
          <p>Nenhum confronto definido ainda.</p>
        ) : (
          <ul>
            {finalMatch.map((match) => (
              <li key={match.match}>
                {match.team1.nome} {match.team1Score} x {match.team2Score}{' '}
                {match.team2.nome}
                {match.team1Penalties > 0 || match.team2Penalties > 0 ? (
                  <span>
                    {' '}
                    ({match.team1Penalties} x {match.team2Penalties} nos pênaltis)
                  </span>
                ) : null}
                <strong> - Campeão: {match.winner.nome}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Campeão</h2>

        {champion ? (
          <p>{champion.nome}</p>
        ) : (
          <p>Nenhum campeão definido ainda.</p>
        )}
      </section>

    </main>
  )
}

export default App
