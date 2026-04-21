import flags from 'react-world-flags/src/flags'

import worldCupTrophy from '../assets/World-Cup-Trophy.png'
import { getTeamCode } from '../data/teamCodes'
import { getTeamFlagCode } from '../data/teamFlagCodes'

function BracketSide({ team, side, isWinner, isChampion }) {
  const teamCode = getTeamCode(team.nome)
  const flagCode = getTeamFlagCode(teamCode)
  const flagSrc = flags[`flag_${flagCode.replace('-', '_')}`]
  const teamClassName = [
    'bracket-side',
    `side-${side}`,
    isWinner ? 'winner' : '',
    isChampion ? 'champion-team' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={teamClassName}>
      <span className="team-flag-frame">
        {flagSrc ? (
          <img className="team-flag" src={flagSrc} alt={`Bandeira ${teamCode}`} />
        ) : (
          <span className="team-flag-fallback">{teamCode}</span>
        )}
      </span>
      <span className="team-name">{teamCode}</span>
    </div>
  )
}

function BracketMatch({ match, champion, showLabel = true }) {
  const hasPenalties = match.team1Penalties > 0 || match.team2Penalties > 0
  const championToken = champion?.token
  const team1Wins = match.winner.token === match.team1.token
  const team2Wins = match.winner.token === match.team2.token

  return (
    <article className="bracket-match">
      {showLabel ? <span className="match-label">Jogo {match.match}</span> : null}
      <div className="scoreboard-row">
        <BracketSide
          team={match.team1}
          side="left"
          isWinner={team1Wins}
          isChampion={championToken === match.team1.token}
        />
        <strong className="match-score">
          {hasPenalties ? (
            <span className="penalty-score">
              <span>{match.team1Penalties}</span>
              <span className="penalty-separator">◆</span>
              <span>{match.team2Penalties}</span>
            </span>
          ) : null}
          <span>{match.team1Score}</span>
          <span className="score-separator">◆</span>
          <span>{match.team2Score}</span>
        </strong>
        <BracketSide
          team={match.team2}
          side="right"
          isWinner={team2Wins}
          isChampion={championToken === match.team2.token}
        />
      </div>
    </article>
  )
}

function BracketSlot({ match, className, champion, showLabel = true }) {
  if (!match) {
    return null
  }

  return (
    <div className={`bracket-slot ${className}`}>
      <BracketMatch match={match} champion={champion} showLabel={showLabel} />
    </div>
  )
}

function StageLabel({ children, className }) {
  return <span className={`bracket-stage-label ${className}`}>{children}</span>
}

function ChampionShowcase({ champion, isRaised = false }) {
  if (!champion) {
    return null
  }

  const className = [
    'bracket-champion-showcase',
    isRaised ? 'champion-showcase-raised' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={className} aria-label={`Campeão ${champion.nome}`}>
      <img className="bracket-trophy" src={worldCupTrophy} alt="" aria-hidden="true" />
      <span className="bracket-champion-kicker">Campeão</span>
      <strong className="bracket-champion-name">{champion.nome}</strong>
    </div>
  )
}

export default function BracketView({
  roundOf16,
  quarterFinals,
  semifinals,
  thirdPlaceMatch,
  finalMatch,
  champion,
}) {
  const hasBracket = roundOf16.length > 0
  const finalHasPenalties =
    finalMatch[0] && (finalMatch[0].team1Penalties > 0 || finalMatch[0].team2Penalties > 0)
  const thirdPlaceHasPenalties =
    thirdPlaceMatch[0] &&
    (thirdPlaceMatch[0].team1Penalties > 0 || thirdPlaceMatch[0].team2Penalties > 0)
  const thirdPlaceLabelClassName = [
    'label-third-place',
    thirdPlaceHasPenalties ? 'third-place-label-raised' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section className="bracket-view">
      <div className="bracket-title">
        <p className="eyebrow">Fase eliminatória</p>
        <h2>Chaveamento da Copa</h2>
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
            <path d="M11 15 H19 V25 H25" />
            <path d="M11 35 H19 V25 H25" />
            <path d="M11 65 H19 V75 H25" />
            <path d="M11 85 H19 V75 H25" />

            <path d="M31 25 H34 V52 H40" />
            <path d="M31 75 H34 V52 H40" />
            <path d="M43 52 H57" />
            <path d="M51 31 V52" />

            <path d="M89 15 H81 V25 H75" />
            <path d="M89 35 H81 V25 H75" />
            <path d="M89 65 H81 V75 H75" />
            <path d="M89 85 H81 V75 H75" />

            <path d="M71 25 H66 V52 H60" />
            <path d="M71 75 H66 V52 H60" />
          </svg>

          <StageLabel className="label-left-r16">Oitavas</StageLabel>
          <StageLabel className="label-left-qtr">Quartas</StageLabel>
          <StageLabel className="label-left-semi">Semi</StageLabel>
          <ChampionShowcase champion={champion} isRaised={finalHasPenalties} />
          <StageLabel className={thirdPlaceLabelClassName}>Terceiro lugar</StageLabel>
          <StageLabel className="label-right-semi">Semi</StageLabel>
          <StageLabel className="label-right-qtr">Quartas</StageLabel>
          <StageLabel className="label-right-r16">Oitavas</StageLabel>

          <BracketSlot
            match={finalMatch[0]}
            className="slot-final"
            champion={champion}
            showLabel={false}
          />
          <BracketSlot
            match={thirdPlaceMatch[0]}
            className="slot-third-place"
            champion={champion}
            showLabel={false}
          />

          <BracketSlot match={semifinals[0]} className="slot-left-semi" champion={champion} />
          <BracketSlot match={semifinals[1]} className="slot-right-semi" champion={champion} />

          <BracketSlot match={quarterFinals[0]} className="slot-left-qtr-1" champion={champion} />
          <BracketSlot match={quarterFinals[1]} className="slot-left-qtr-2" champion={champion} />
          <BracketSlot match={quarterFinals[2]} className="slot-right-qtr-1" champion={champion} />
          <BracketSlot match={quarterFinals[3]} className="slot-right-qtr-2" champion={champion} />

          <BracketSlot match={roundOf16[0]} className="slot-left-r16-1" champion={champion} />
          <BracketSlot match={roundOf16[1]} className="slot-left-r16-2" champion={champion} />
          <BracketSlot match={roundOf16[2]} className="slot-left-r16-3" champion={champion} />
          <BracketSlot match={roundOf16[3]} className="slot-left-r16-4" champion={champion} />
          <BracketSlot match={roundOf16[4]} className="slot-right-r16-1" champion={champion} />
          <BracketSlot match={roundOf16[5]} className="slot-right-r16-2" champion={champion} />
          <BracketSlot match={roundOf16[6]} className="slot-right-r16-3" champion={champion} />
          <BracketSlot match={roundOf16[7]} className="slot-right-r16-4" champion={champion} />
        </div>
      )}
    </section>
  )
}
