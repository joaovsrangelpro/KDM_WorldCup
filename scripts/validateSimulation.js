import { drawGroups, validateGroups } from '../src/simulation/groupDraw.js'
import {
  calculateGroupStandings,
  generateAllGroupMatches,
  simulateGroupMatches,
} from '../src/simulation/groupStage.js'
import {
  generateNextKnockoutRound,
  generateRoundOf16,
  generateThirdPlaceMatch,
  simulateKnockoutMatches,
} from '../src/simulation/knockoutStage.js'

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function createMockTeams() {
  return Array.from({ length: 32 }, (_, index) => ({
    token: `T${index + 1}`,
    nome: `Team ${index + 1}`,
  }))
}

function getGroupMatchCount(groupMatch) {
  return groupMatch.rounds.reduce(
    (total, round) => total + round.matches.length,
    0,
  )
}

function getGroupTeamGames(groupMatch) {
  const gamesByTeam = new Map()

  groupMatch.rounds.forEach((round) => {
    round.matches.forEach((match) => {
      gamesByTeam.set(match.team1.token, (gamesByTeam.get(match.team1.token) || 0) + 1)
      gamesByTeam.set(match.team2.token, (gamesByTeam.get(match.team2.token) || 0) + 1)
    })
  })

  return gamesByTeam
}

function getGroupPairings(groupMatch) {
  const pairings = new Set()

  groupMatch.rounds.forEach((round) => {
    round.matches.forEach((match) => {
      const pairing = [match.team1.token, match.team2.token].sort().join('-')
      pairings.add(pairing)
    })
  })

  return pairings
}

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

function validatePenaltyResolution() {
  const originalRandom = Math.random

  try {
    const values = [0.5, 0.5, 0.2, 0.8]
    let index = 0

    Math.random = () => values[index++ % values.length]

    const [match] = simulateKnockoutMatches([
      {
        match: 1,
        team1: { token: 'A', nome: 'Team A' },
        team2: { token: 'B', nome: 'Team B' },
      },
    ])

    assert(match.team1Score === match.team2Score, 'Forced knockout match should be tied')
    assert(
      match.team1Penalties !== match.team2Penalties,
      'Tied knockout match should be resolved by penalties',
    )
    assert(match.winner, 'Penalty shootout should define a winner')
  } finally {
    Math.random = originalRandom
  }
}

const teams = createMockTeams()
const groups = drawGroups(teams)
const groupValidation = validateGroups(groups)
const generatedGroupMatches = generateAllGroupMatches(groups)
const simulatedGroupMatches = simulateGroupMatches(generatedGroupMatches)
const groupStandings = calculateGroupStandings(simulatedGroupMatches)

const roundOf16 = simulateKnockoutMatches(generateRoundOf16(groupStandings))
const quarterFinals = simulateKnockoutMatches(generateNextKnockoutRound(roundOf16))
const semifinals = simulateKnockoutMatches(generateNextKnockoutRound(quarterFinals))
const thirdPlaceMatch = simulateKnockoutMatches(generateThirdPlaceMatch(semifinals))
const finalMatch = simulateKnockoutMatches(generateNextKnockoutRound(semifinals))
const finalResultPayload = buildFinalResultPayload(finalMatch[0])
const expectedPayloadFields = [
  'equipeA',
  'equipeB',
  'golsEquipeA',
  'golsEquipeB',
  'golsPenaltyTimeA',
  'golsPenaltyTimeB',
]

assert(groupValidation.isValid, 'Groups should contain 8 groups and 32 unique teams')
assert(groups.length === 8, 'Simulation should generate 8 groups')
assert(groups.every((group) => group.teams.length === 4), 'Each group should contain 4 teams')
assert(
  generatedGroupMatches.every((groupMatch) => groupMatch.rounds.length === 3),
  'Each group should contain 3 rounds',
)
assert(
  generatedGroupMatches.every((groupMatch) => getGroupMatchCount(groupMatch) === 6),
  'Each group should contain 6 matches',
)
assert(
  generatedGroupMatches.every((groupMatch) =>
    Array.from(getGroupTeamGames(groupMatch).values()).every((games) => games === 3),
  ),
  'Each team should play 3 group-stage matches',
)
assert(
  generatedGroupMatches.every((groupMatch) => getGroupPairings(groupMatch).size === 6),
  'Each group should have 6 unique matchups',
)
assert(
  groupStandings.every((groupStanding) => groupStanding.qualifiedTeams.length === 2),
  'Each group should qualify 2 teams',
)
assert(
  groupStandings.flatMap((groupStanding) => groupStanding.qualifiedTeams).length === 16,
  'Group stage should qualify 16 teams',
)
assert(roundOf16.length === 8, 'Round of 16 should contain 8 matches')
assert(quarterFinals.length === 4, 'Quarterfinals should contain 4 matches')
assert(semifinals.length === 2, 'Semifinals should contain 2 matches')
assert(finalMatch.length === 1, 'Final should contain 1 match')
assert(thirdPlaceMatch.length === 1, 'Third-place match should contain 1 match')
assert(finalMatch[0].winner, 'Final should define a champion')
assert(
  expectedPayloadFields.every((field) => field in finalResultPayload) &&
    Object.keys(finalResultPayload).length === expectedPayloadFields.length,
  'Final result payload should contain the expected API fields',
)

validatePenaltyResolution()

console.log('Simulation validation passed.')
console.table({
  groups: groups.length,
  teamsPerGroup: 4,
  matchesPerGroup: 6,
  qualifiedTeams: 16,
  roundOf16: roundOf16.length,
  quarterFinals: quarterFinals.length,
  semifinals: semifinals.length,
  final: finalMatch.length,
  thirdPlace: thirdPlaceMatch.length,
})
