import { useState } from 'react'
import { getAllTeams } from './services/worldCupApi'

function App() {
  const [teams, setTeams] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLoadTeams() {
    try {
      setIsLoading(true)
      setError('')

      const teamsFromApi = await getAllTeams()

      console.log('Seleções retornadas pela API:', teamsFromApi)
      setTeams(teamsFromApi)
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
        <p>Primeiro teste: consumir a API oficial das 32 seleções.</p>

        <button type="button" onClick={handleLoadTeams} disabled={isLoading}>
          {isLoading ? 'Carregando...' : 'Buscar seleções'}
        </button>

        {error && <p>{error}</p>}
      </section>

      <section>
        <h2>Seleções carregadas: {teams.length}</h2>

        {teams.length === 0 ? (
          <p>Nenhuma seleção carregada ainda.</p>
        ) : (
          <ul>
            {teams.map((team, index) => (
              <li key={team.id || team.Id || index}>
                {team.name || team.Name || team.country || team.Country || JSON.stringify(team)}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
