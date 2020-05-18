import React, { StrictMode } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { ThemeType } from '../utils/Theme';

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  player: {
    float: 'left',
    height: theme.height,
    lineHeight: theme.height,
    width: '50%',
  },
}));

/**
 * PlayerType
 */
export interface PlayerType {
  playerID: string;
  playerName: string;
  stats: CompetitorStats;
}

/**
 * CompetitorStatus
 */
export class CompetitorStats {
  numMatches: number;

  numWon: number;

  numDraws: number;

  numLost: number;

  constructor() {
    this.numMatches = 0;
    this.numWon = 0;
    this.numDraws = 0;
    this.numLost = 0;
  }
}

/**
 * initialize players
 *
 * @param numPlayers number of players
 */
export const getPlayers = (numPlayers: number): PlayerType[] => {
  const players = [];

  for (let p = 0; p < numPlayers; p += 1) {
    const player: PlayerType = {
      playerID: String(players.length + 1),
      playerName: '',
      stats: new CompetitorStats(),
    };
    players.push(player);
  }

  return players;
};

/**
 * PlayerProps
 */
type PlayerProps = {
  playerID: string;
};

/**
 * Player
 *
 * @param props
 */
const Player = (props: PlayerProps): JSX.Element => {
  const { playerID } = props;

  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <StrictMode>
      <div className={classes.player}>
        {playerID}
      </div>
    </StrictMode>
  );
};

export default Player;
