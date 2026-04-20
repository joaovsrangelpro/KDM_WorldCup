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
