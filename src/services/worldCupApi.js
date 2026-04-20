const BASE_URL = 'https://development-internship-api.geopostenergy.com/WorldCup'
const GIT_USER = 'joaovsrangelpro'

export async function getAllTeams(gitUser) {
  const response = await fetch(`${BASE_URL}/GetAllTeams`, {
    method: 'GET',
    headers: {
      'git-user': GIT_USER,
    },
  })

  if (!response.ok) {
    throw new Error('Não foi possível carregar as seleções')
  }

  return response.json()
}

export async function sendFinalResult(finalResult) {
  const response = await fetch(`${BASE_URL}/FinalResult`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'git-user': 'joaovsrangelpro',
    },
    body: JSON.stringify(finalResult),
  })

  const responseText = await response.text()

  if (!response.ok) {
    throw new Error(responseText || 'Não foi possível enviar o resultado final')
  }

  if (!responseText) {
    return null
  }

  try {
    return JSON.parse(responseText)
  } catch {
    return responseText
  }
}
