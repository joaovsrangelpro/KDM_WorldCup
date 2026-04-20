const BASE_URL = 'https://development-internship-api.geopostenergy.com/WorldCup'

export async function getAllTeams(gitUser) {
  const response = await fetch(`${BASE_URL}/GetAllTeams`, {
    method: 'GET',
    headers: {
      'git-user': 'joaovsrangelpro',
    },
  })

  if (!response.ok) {
    throw new Error('Não foi possível carregar as seleções')
  }

  return response.json()
}
