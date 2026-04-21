import { useState } from 'react'
import BracketView from './components/BracketView'
import { getAllTeams, sendFinalResult } from './services/worldCupApi'
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
  generateThirdPlaceMatch,
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
  const [thirdPlaceMatch, setThirdPlaceMatch] = useState([])
  const [finalMatch, setFinalMatch] = useState([])
  const [champion, setChampion] = useState(null)

  const [isLoading, setIsLoading] = useState(false)
  const [isSendingFinalResult, setIsSendingFinalResult] = useState(false)
  const [error, setError] = useState('')
  const [finalResultStatus, setFinalResultStatus] = useState('')
  const [activeView, setActiveView] = useState('overview')

  function buildFinalResultPayload(match) {
    return {
      equipeA: match.team1.token,
      equipeB: match.team2.token,
      golsEquipeA: match.team1Score,
      golsEquipeB: match.team2Score,
      golsPenaltyTimeA: match.team1Penalties,
      golsPenaltyTimeB: match.team2Penalties,
    }
  }

  async function handleLoadTeams() {
    try {
      setIsLoading(true)
      setError('')
      setFinalResultStatus('')

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

      const thirdPlaceMatches = generateThirdPlaceMatch(simulatedSemifinalMatches)
      const simulatedThirdPlaceMatches = simulateKnockoutMatches(thirdPlaceMatches)

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
      setThirdPlaceMatch(simulatedThirdPlaceMatches)
      setFinalMatch(simulatedFinalMatches)
      setChampion(tournamentChampion)

    } catch (err) {
      console.error(err)
      setError('Não foi possível buscar as seleções. Confira o console.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSendFinalResult() {
    if (finalMatch.length === 0) {
      setFinalResultStatus('Simule a Copa antes de enviar o resultado final.')
      return
    }

    try {
      setIsSendingFinalResult(true)
      setFinalResultStatus('')

      const finalResultPayload = buildFinalResultPayload(finalMatch[0])
      const response = await sendFinalResult(finalResultPayload)

      console.log('Resultado final enviado:', finalResultPayload)
      console.log('Resposta da API:', response)
      setFinalResultStatus('Resultado final enviado com sucesso.')
    } catch (err) {
      console.error(err)
      setFinalResultStatus('Não foi possível enviar o resultado final. Confira o console.')
    } finally {
      setIsSendingFinalResult(false)
    }
  }

  function renderKnockoutMatches(matches) {
    return (
      <ul className="match-list">
        {matches.map((match) => (
          <li className="match-card" key={match.match}>
            <span className="match-label">Jogo {match.match}</span>
            <span>
              {match.team1.nome} {match.team1Score} x {match.team2Score} {match.team2.nome}
            </span>
            {match.team1Penalties > 0 || match.team2Penalties > 0 ? (
              <span className="penalties">
                {match.team1Penalties} x {match.team2Penalties} nos pênaltis
              </span>
            ) : null}
            <strong>Vencedor: {match.winner.nome}</strong>
          </li>
        ))}
      </ul>
    )
  }

  function renderGroupMatch(match) {
    const team1Won = match.team1Score > match.team2Score
    const team2Won = match.team2Score > match.team1Score

    return (
      <>
        <span className={team1Won ? 'group-match-winner' : ''}>{match.team1.nome}</span>{' '}
        {match.team1Score} x {match.team2Score}{' '}
        <span className={team2Won ? 'group-match-winner' : ''}>{match.team2.nome}</span>
      </>
    )
  }

  return (
    <main className="app">
      <section className="hero-section">
        <p className="eyebrow">Katalyst Data Management</p>
        <h1>KDM World Cup Simulator</h1>
        <p>Consuma a API, sorteie os grupos, simule a Copa e envie o resultado final.</p>

        <button className="primary-button" type="button" onClick={handleLoadTeams} disabled={isLoading}>
          {isLoading ? 'Carregando...' : 'Buscar seleções e sortear grupos'}
        </button>

        {error && <p className="status-message error">{error}</p>}
      </section>

      <nav className="view-switcher" aria-label="Alternar visualização">
        <button
          className={activeView === 'overview' ? 'view-button active' : 'view-button'}
          type="button"
          onClick={() => setActiveView('overview')}
        >
          Visão geral
        </button>
        <button
          className={activeView === 'bracket' ? 'view-button active' : 'view-button'}
          type="button"
          onClick={() => setActiveView('bracket')}
        >
          Chaveamento
        </button>
      </nav>

      {activeView === 'bracket' ? (
        <>
          <BracketView
            roundOf16={roundOf16}
            quarterFinals={quarterFinals}
            semifinals={semifinals}
            thirdPlaceMatch={thirdPlaceMatch}
            finalMatch={finalMatch}
            champion={champion}
          />

          <section className="bracket-submit-section">
            <button
              className="primary-button"
              type="button"
              onClick={handleSendFinalResult}
              disabled={!champion || isSendingFinalResult}
            >
              {isSendingFinalResult ? 'Enviando resultado...' : 'Enviar resultado final'}
            </button>

            {finalResultStatus && <p className="status-message">{finalResultStatus}</p>}
          </section>
        </>
      ) : (
        <>
      <section className="section-card">
        <div className="section-header">
          <h2>Seleções carregadas</h2>
          <span className="counter">{teams.length}</span>
        </div>

        {teams.length === 0 ? (
          <p className="empty-state">Nenhuma seleção carregada ainda.</p>
        ) : (
          <ul className="teams-list">
            {teams.map((team) => (
              <li key={team.token}>{team.nome}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="section-card">
        <h2>Grupos sorteados</h2>

        {groups.length === 0 ? (
          <p className="empty-state">Nenhum grupo sorteado ainda.</p>
        ) : (
          <div className="groups-grid">
            {groups.map((group) => (
              <article className="group-card" key={group.name}>
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

      <section className="section-card">
      <h2>Partidas da fase de grupos</h2>

      {groupMatches.length === 0 ? (
        <p className="empty-state">Nenhuma partida gerada ainda.</p>
      ) : (
        <div className="groups-grid">
          {groupMatches.map((groupMatch) => (
            <article className="group-card" key={groupMatch.groupName}>
              <h3>Grupo {groupMatch.groupName}</h3>

              {groupMatch.rounds.map((round) => (
                <div className="round-block" key={`${groupMatch.groupName}-${round.round}`}>
                  <h4>Rodada {round.round}</h4>

                  <ul className="match-list compact">
                    {round.matches.map((match) => (
                      <li key={`${match.team1.token}-${match.team2.token}`}>
                        {renderGroupMatch(match)}
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

      <section className="section-card">
        <h2>Classificação dos grupos</h2>

        {groupStandings.length === 0 ? (
          <p className="empty-state">Nenhuma classificação calculada ainda.</p>
        ) : (
          <div className="standings-grid">
            {groupStandings.map((groupStanding) => (
              <article className="standings-card" key={groupStanding.groupName}>
                <h3>Grupo {groupStanding.groupName}</h3>

                <table className="standings-table">
                  <thead>
                    <tr>
                      <th>Pos</th>
                      <th>Seleção</th>
                      <th>Pts</th>
                      <th>Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupStanding.table.map((standing, index) => (
                      <tr className={index < 2 ? 'qualified-row' : ''} key={standing.team.token}>
                        <td>{index + 1}</td>
                        <td>{standing.team.nome}</td>
                        <td>{standing.points}</td>
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

      <section className="section-card">
        <h2>Oitavas de final</h2>

        {roundOf16.length === 0 ? (
          <p className="empty-state">Nenhum confronto definido ainda.</p>
        ) : (
          renderKnockoutMatches(roundOf16)
        )}
      </section>

      <section className="section-card">
        <h2>Quartas de final</h2>

        {quarterFinals.length === 0 ? (
          <p className="empty-state">Nenhum confronto definido ainda.</p>
        ) : (
          renderKnockoutMatches(quarterFinals)
        )}
      </section>

      <section className="section-card">
        <h2>Semifinais</h2>

        {semifinals.length === 0 ? (
          <p className="empty-state">Nenhum confronto definido ainda.</p>
        ) : (
          renderKnockoutMatches(semifinals)
        )}
      </section>

      <section className="section-card">
        <h2>Terceiro lugar</h2>

        {thirdPlaceMatch.length === 0 ? (
          <p className="empty-state">Nenhum confronto definido ainda.</p>
        ) : (
          renderKnockoutMatches(thirdPlaceMatch)
        )}
      </section>

      <section className="section-card">
        <h2>Final</h2>

        {finalMatch.length === 0 ? (
          <p className="empty-state">Nenhum confronto definido ainda.</p>
        ) : (
          <ul className="match-list">
            {finalMatch.map((match) => (
              <li className="match-card final-match" key={match.match}>
                <span>
                  {match.team1.nome} {match.team1Score} x {match.team2Score}{' '}
                {match.team2.nome}
                </span>
                {match.team1Penalties > 0 || match.team2Penalties > 0 ? (
                  <span className="penalties">
                    {match.team1Penalties} x {match.team2Penalties} nos pênaltis
                  </span>
                ) : null}
                <strong>Campeão: {match.winner.nome}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="champion-section">
        <h2>Campeão</h2>

        {champion ? (
          <p className="champion-name">{champion.nome}</p>
        ) : (
          <p className="empty-state">Nenhum campeão definido ainda.</p>
        )}

        <button
          className="primary-button"
          type="button"
          onClick={handleSendFinalResult}
          disabled={!champion || isSendingFinalResult}
        >
          {isSendingFinalResult ? 'Enviando resultado...' : 'Enviar resultado final'}
        </button>

        {finalResultStatus && <p className="status-message">{finalResultStatus}</p>}
      </section>
        </>
      )}

    </main>
  )
}

export default App
