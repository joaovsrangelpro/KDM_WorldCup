const GROUP_NAMES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

function shuffleTeams(teams) {
  const shuffledTeams = [...teams]

  for (let index = shuffledTeams.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))

    const currentTeam = shuffledTeams[index]
    shuffledTeams[index] = shuffledTeams[randomIndex]
    shuffledTeams[randomIndex] = currentTeam
  }

  return shuffledTeams
}

export function drawGroups(teams) {
  const shuffledTeams = shuffleTeams(teams)

  return GROUP_NAMES.map((groupName, index) => {
    const start = index * 4
    const end = start + 4

    return {
      name: groupName,
      teams: shuffledTeams.slice(start, end),
    }
  })
}


export function validateGroups(groups) {
  const groupedTeams = groups.flatMap((group) => group.teams)
  const uniqueTeamTokens = new Set(groupedTeams.map((team) => team.token))

  return {
    totalGroups: groups.length,
    teamsPerGroup: groups.map((group) => group.teams.length),
    totalTeams: groupedTeams.length,
    uniqueTeams: uniqueTeamTokens.size,
    isValid:
      groups.length === 8 &&
      groups.every((group) => group.teams.length === 4) &&
      groupedTeams.length === 32 &&
      uniqueTeamTokens.size === 32,
  }
}