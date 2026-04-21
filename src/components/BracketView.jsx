function getPenaltyText(match) {
  if (match.team1Penalties === 0 && match.team2Penalties === 0) {
    return null
  }

  return `${match.team1Penalties} x ${match.team2Penalties} nos pênaltis`
}

function BracketTeam({ team, score, isWinner }) {
  return (
    <div className={isWinner ? 'bracket-team winner' : 'bracket-team'}>
      <span className="team-name">{team.nome}</span>
      <strong className="team-score">{score}</strong>
    </div>
  )
}

function BracketMatch({ match }) {
  const penaltyText = getPenaltyText(match)

  return (
    <article className="bracket-match">
      <span className="match-label">Jogo {match.match}</span>
      <BracketTeam
        team={match.team1}
        score={match.team1Score}
        isWinner={match.winner.token === match.team1.token}
      />
      <BracketTeam
        team={match.team2}
        score={match.team2Score}
        isWinner={match.winner.token === match.team2.token}
      />
      {penaltyText ? <span className="penalties">{penaltyText}</span> : null}
    </article>
  )
}

function BracketSlot({ match, className }) {
  if (!match) {
    return null
  }

  return (
    <div className={`bracket-slot ${className}`}>
      <BracketMatch match={match} />
    </div>
  )
}

function StageLabel({ children, className }) {
  return <span className={`bracket-stage-label ${className}`}>{children}</span>
}

export default function BracketView({
  roundOf16,
  quarterFinals,
  semifinals,
  finalMatch,
}) {
  const hasBracket = roundOf16.length > 0

  return (
    <section className="bracket-view">
      <div className="bracket-title">
        <p className="eyebrow">Fase eliminatória</p>
        <h2>World Cup Bracket</h2>
      </div>

      {!hasBracket ? (
        <p className="empty-state">Simule a Copa para visualizar o chaveamento.</p>
      ) : (
        <div className="bracket-board">
          <svg
            className="bracket-lines"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M10 15 H20 V25 H26" />
            <path d="M10 35 H20 V25 H26" />
            <path d="M10 65 H20 V75 H26" />
            <path d="M10 85 H20 V75 H26" />

            <path d="M29 25 H34 V50 H40" />
            <path d="M29 75 H34 V50 H40" />
            <path d="M43 56 H47 V24 H46" />

            <path d="M90 15 H80 V25 H74" />
            <path d="M90 35 H80 V25 H74" />
            <path d="M90 65 H80 V75 H74" />
            <path d="M90 85 H80 V75 H74" />

            <path d="M71 25 H66 V50 H60" />
            <path d="M71 75 H66 V50 H60" />
            <path d="M57 56 H53 V24 H54" />

          </svg>

          <StageLabel className="label-left-r16">Oitavas</StageLabel>
          <StageLabel className="label-left-qtr">Quartas</StageLabel>
          <StageLabel className="label-left-semi">Semi</StageLabel>
          <StageLabel className="label-final">Final</StageLabel>
          <StageLabel className="label-right-semi">Semi</StageLabel>
          <StageLabel className="label-right-qtr">Quartas</StageLabel>
          <StageLabel className="label-right-r16">Oitavas</StageLabel>

          <BracketSlot match={finalMatch[0]} className="slot-final" />

          <BracketSlot match={semifinals[0]} className="slot-left-semi" />
          <BracketSlot match={semifinals[1]} className="slot-right-semi" />

          <BracketSlot match={quarterFinals[0]} className="slot-left-qtr-1" />
          <BracketSlot match={quarterFinals[1]} className="slot-left-qtr-2" />
          <BracketSlot match={quarterFinals[2]} className="slot-right-qtr-1" />
          <BracketSlot match={quarterFinals[3]} className="slot-right-qtr-2" />

          <BracketSlot match={roundOf16[0]} className="slot-left-r16-1" />
          <BracketSlot match={roundOf16[1]} className="slot-left-r16-2" />
          <BracketSlot match={roundOf16[2]} className="slot-left-r16-3" />
          <BracketSlot match={roundOf16[3]} className="slot-left-r16-4" />
          <BracketSlot match={roundOf16[4]} className="slot-right-r16-1" />
          <BracketSlot match={roundOf16[5]} className="slot-right-r16-2" />
          <BracketSlot match={roundOf16[6]} className="slot-right-r16-3" />
          <BracketSlot match={roundOf16[7]} className="slot-right-r16-4" />
        </div>
      )}
    </section>
  )
}
