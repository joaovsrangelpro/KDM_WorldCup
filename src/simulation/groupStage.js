function generateRandomScore() {
  return Math.floor(Math.random() * 6)
}

function simulateMatch(match) {
  return {
    ...match,
    team1Score: generateRandomScore(),
    team2Score: generateRandomScore(),
  }
}

function createInitialStanding(team) {
  return {
    team,
    points: 0,
    games: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
  }
}

function applyMatchToStandings(standings, match) {
  const team1Standing = standings.get(match.team1.token)
  const team2Standing = standings.get(match.team2.token)

  team1Standing.games += 1
  team2Standing.games += 1

  team1Standing.goalsFor += match.team1Score
  team1Standing.goalsAgainst += match.team2Score

  team2Standing.goalsFor += match.team2Score
  team2Standing.goalsAgainst += match.team1Score

  team1Standing.goalDifference =
    team1Standing.goalsFor - team1Standing.goalsAgainst

  team2Standing.goalDifference =
    team2Standing.goalsFor - team2Standing.goalsAgainst

  if (match.team1Score > match.team2Score) {
    team1Standing.points += 3
    team1Standing.wins += 1
    team2Standing.losses += 1
  } else if (match.team2Score > match.team1Score) {
    team2Standing.points += 3
    team2Standing.wins += 1
    team1Standing.losses += 1
  } else {
    team1Standing.points += 1
    team2Standing.points += 1
    team1Standing.draws += 1
    team2Standing.draws += 1
  }
}

export function generateGroupMatches(group) {
  const [teamA, teamB, teamC, teamD] = group.teams

  return {
    groupName: group.name,
    rounds: [
      {
        round: 1,
        matches: [
          { team1: teamA, team2: teamB },
          { team1: teamC, team2: teamD },
        ],
      },
      {
        round: 2,
        matches: [
          { team1: teamA, team2: teamC },
          { team1: teamB, team2: teamD },
        ],
      },
      {
        round: 3,
        matches: [
          { team1: teamA, team2: teamD },
          { team1: teamB, team2: teamC },
        ],
      },
    ],
  }
}

export function generateAllGroupMatches(groups) {
  return groups.map(generateGroupMatches)
}

export function simulateGroupMatches(groupMatches) {
  return groupMatches.map((groupMatch) => ({
    ...groupMatch,
    rounds: groupMatch.rounds.map((round) => ({
      ...round,
      matches: round.matches.map(simulateMatch),
    })),
  }))
}

export function calculateGroupStandings(groupMatches) {
  return groupMatches.map((groupMatch) => {
    const teams = groupMatch.rounds[0].matches.flatMap((match) => [
      match.team1,
      match.team2,
    ])

    const uniqueTeams = Array.from(
      new Map(teams.map((team) => [team.token, team])).values(),
    )

    const standings = new Map(
      uniqueTeams.map((team) => [team.token, createInitialStanding(team)]),
    )

    groupMatch.rounds.forEach((round) => {
      round.matches.forEach((match) => {
        applyMatchToStandings(standings, match)
      })
    })

    const table = Array.from(standings.values())
      .map((standing) => ({
        ...standing,
        drawOrder: Math.random(),
      }))
      .sort((teamA, teamB) => {
        if (teamB.points !== teamA.points) {
          return teamB.points - teamA.points
        }

        if (teamB.goalDifference !== teamA.goalDifference) {
          return teamB.goalDifference - teamA.goalDifference
        }

        return teamA.drawOrder - teamB.drawOrder
      })

    return {
      groupName: groupMatch.groupName,
      table,
      qualifiedTeams: table.slice(0, 2),
    }
  })
}
