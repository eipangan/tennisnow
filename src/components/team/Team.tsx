import React, { StrictMode, useContext } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { AppContext } from '../../App';
import Player, { CompetitorStats, PlayerType } from '../player/Player';
import { ThemeType } from '../utils/Theme';

const useStyle = createUseStyles((theme: ThemeType) => {
  const team = {
    height: theme.height,
    lineHeight: theme.height,
    outline: 'none',
    width: '100%',
  };

  return ({
    teamDefault: {
      ...team,
    },
    teamWon: {
      ...team,
      background: theme.match.won.background,
    },
    teamDraw: {
      ...team,
      background: theme.match.lost.background,
      color: theme.match.lost.color,
    },
    teamLost: {
      ...team,
      background: theme.match.lost.background,
      color: theme.match.lost.color,
    },
  });
});

/**
 * TeamType
 */
export interface TeamType {
  teamID: string;
  playerIDs: readonly [string, string];
  stats: CompetitorStats;
}

/**
 * initialize teams
 *
 * @param players players in the event
 */
export const getTeams = (players: PlayerType[]): TeamType[] => {
  if (!players) return [];

  const teams = [];
  for (let p = 0; p < players.length; p += 1) {
    for (let np = p; np < players.length; np += 1) {
      if (p !== np) {
        const team: TeamType = {
          teamID: String(teams.length + 1),
          playerIDs: [players[p].playerID, players[np].playerID],
          stats: new CompetitorStats(),
        };
        teams.push(team);
      }
    }
  }

  return teams;
};

/**
 * record draw for the given team, and update player states as well
 *
 * @param team
 * @param players
 */
export const recordDraw = (team: TeamType, players: PlayerType[]) => {
  // eslint-disable-next-line no-param-reassign
  team.stats.numDraws += 1;

  const player1 = players.find(({ playerID }) => playerID === team.playerIDs[0]);
  const player2 = players.find(({ playerID }) => playerID === team.playerIDs[1]);

  if (!player1 || !player2) return;

  player1.stats.numDraws += 1;
  player2.stats.numDraws += 1;
};

/**
 * record loss for the given team, and update player states as well
 *
 * @param team
 * @param players
 */
export const recordLoss = (team: TeamType, players: PlayerType[]) => {
  // eslint-disable-next-line no-param-reassign
  team.stats.numLost += 1;

  const player1 = players.find(({ playerID }) => playerID === team.playerIDs[0]);
  const player2 = players.find(({ playerID }) => playerID === team.playerIDs[1]);

  if (!player1 || !player2) return;

  player1.stats.numLost += 1;
  player2.stats.numLost += 1;
};

/**
 * record win for the given team, and update player states as well
 *
 * @param team
 * @param players
 */
export const recordWin = (team: TeamType, players: PlayerType[]) => {
  // eslint-disable-next-line no-param-reassign
  team.stats.numWon += 1;

  const player1 = players.find(({ playerID }) => playerID === team.playerIDs[0]);
  const player2 = players.find(({ playerID }) => playerID === team.playerIDs[1]);

  if (!player1 || !player2) return;

  player1.stats.numWon += 1;
  player2.stats.numWon += 1;
};

/**
 * undo draw for the given team, and update player states as well
 *
 * @param team
 * @param players
 */
export const undoDraw = (team: TeamType, players: PlayerType[]) => {
  // eslint-disable-next-line no-param-reassign
  team.stats.numDraws -= 1;

  const player1 = players.find(({ playerID }) => playerID === team.playerIDs[0]);
  const player2 = players.find(({ playerID }) => playerID === team.playerIDs[1]);

  if (!player1 || !player2) return;

  player1.stats.numDraws -= 1;
  player2.stats.numDraws -= 1;
};

/**
 * undo loss for the given team, and update player states as well
 *
 * @param team
 * @param players
 */
export const undoLoss = (team: TeamType, players: PlayerType[]) => {
  // eslint-disable-next-line no-param-reassign
  team.stats.numLost -= 1;

  const player1 = players.find(({ playerID }) => playerID === team.playerIDs[0]);
  const player2 = players.find(({ playerID }) => playerID === team.playerIDs[1]);

  if (!player1 || !player2) return;

  player1.stats.numLost -= 1;
  player2.stats.numLost -= 1;
};

/**
 * undo win for the given team, and update player states as well
 *
 * @param team
 * @param players
 */
export const undoWin = (team: TeamType, players: PlayerType[]) => {
  // eslint-disable-next-line no-param-reassign
  team.stats.numWon -= 1;

  const player1 = players.find(({ playerID }) => playerID === team.playerIDs[0]);
  const player2 = players.find(({ playerID }) => playerID === team.playerIDs[1]);

  if (!player1 || !player2) return;

  player1.stats.numWon -= 1;
  player2.stats.numWon -= 1;
};

/**
 * TeamProps
 */
type TeamProps = {
  team: TeamType;
  onClick?: ((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined;
  state?: string;
};

/**
 * Team
 *
 * @param props
 */
const Team = (props: TeamProps): JSX.Element => {
  const theme = useTheme;
  const classes = useStyle({ theme });

  const { team, onClick, state } = props;
  const { event } = useContext(AppContext);
  const { players } = event;

  if (!team || !players) return <></>;

  let teamClass = classes.teamDefault;
  switch (state) {
    case 'won':
      teamClass = classes.teamWon;
      break;
    case 'draw':
      teamClass = classes.teamDraw;
      break;
    case 'lost':
      teamClass = classes.teamLost;
      break;
    default:
      teamClass = classes.teamDefault;
  }

  return (
    <StrictMode>
      <div
        className={teamClass}
        onClick={onClick}
        onKeyDown={() => { }}
        role="button"
        tabIndex={0}
      >
        {team.playerIDs && team.playerIDs.map((id) => (
          <Player
            key={id}
            playerID={id}
          />
        ))}
      </div>
    </StrictMode>
  );
};

export default Team;
