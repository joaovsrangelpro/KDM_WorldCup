function generateRandomScore() {
  return Math.floor(Math.random() * 6)
}

function generatePenaltyScore() {
  return Math.floor(Math.random() * 6)
}

function simulatePenalties() {
  let team1Penalties = generatePenaltyScore()
  let team2Penalties = generatePenaltyScore()

  while (team1Penalties === team2Penalties) {
    team1Penalties = generatePenaltyScore()
    team2Penalties = generatePenaltyScore()
  }

  return {
    team1Penalties,
    team2Penalties,
  }
}

export function generateRoundOf16(groupStandings) {
  const standingsByGroup = new Map(
    groupStandings.map((groupStanding) => [
      groupStanding.groupName,
      groupStanding.qualifiedTeams,
    ]),
  )

  return [
    {
      match: 1,
      team1: standingsByGroup.get('A')[0].team,
      team2: standingsByGroup.get('B')[1].team,
    },
    {
      match: 2,
      team1: standingsByGroup.get('C')[0].team,
      team2: standingsByGroup.get('D')[1].team,
    },
    {
      match: 3,
      team1: standingsByGroup.get('E')[0].team,
      team2: standingsByGroup.get('F')[1].team,
    },
    {
      match: 4,
      team1: standingsByGroup.get('G')[0].team,
      team2: standingsByGroup.get('H')[1].team,
    },
    {
      match: 5,
      team1: standingsByGroup.get('B')[0].team,
      team2: standingsByGroup.get('A')[1].team,
    },
    {
      match: 6,
      team1: standingsByGroup.get('D')[0].team,
      team2: standingsByGroup.get('C')[1].team,
    },
    {
      match: 7,
      team1: standingsByGroup.get('F')[0].team,
      team2: standingsByGroup.get('E')[1].team,
    },
    {
      match: 8,
      team1: standingsByGroup.get('H')[0].team,
      team2: standingsByGroup.get('G')[1].team,
    },
  ]
}

export function simulateKnockoutMatches(matches) {
  return matches.map((match) => {
    const team1Score = generateRandomScore()
    const team2Score = generateRandomScore()

    let team1Penalties = 0
    let team2Penalties = 0
    let winner = null

    if (team1Score > team2Score) {
      winner = match.team1
    } else if (team2Score > team1Score) {
      winner = match.team2
    } else {
      // Knockout matches cannot end tied, so penalties decide tied matches.
      const penalties = simulatePenalties()

      team1Penalties = penalties.team1Penalties
      team2Penalties = penalties.team2Penalties
      winner = team1Penalties > team2Penalties ? match.team1 : match.team2
    }

    return {
      ...match,
      team1Score,
      team2Score,
      team1Penalties,
      team2Penalties,
      winner,
    }
  })
}

export function generateNextKnockoutRound(previousRoundMatches) {
  const winners = previousRoundMatches.map((match) => match.winner)

  const nextRoundMatches = []
  
  // Winners are paired in order to build the next knockout round.
  for (let index = 0; index < winners.length; index += 2) {
    nextRoundMatches.push({
      match: index / 2 + 1,
      team1: winners[index],
      team2: winners[index + 1],
    })
  }

  return nextRoundMatches
}
