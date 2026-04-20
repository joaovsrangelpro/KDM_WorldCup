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