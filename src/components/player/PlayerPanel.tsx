import React, { StrictMode } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { Player } from '../../models';
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
 * initialize players
 *
 * @param numPlayers number of players
 */
export const getPlayers = (numPlayers: number): Player[] => {
  const players: Player[] = [];

  for (let p = 0; p < numPlayers; p += 1) {
    const player: Player = new Player({
      name: '',
    });
    players.push(player);
  }

  return players;
};

/**
 * PlayerProps
 */
type PlayerProps = {
  player: Player;
};

/**
 * Player
 *
 * @param props
 */
const PlayerPanel = (props: PlayerProps): JSX.Element => {
  const { player } = props;

  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <StrictMode>
      <div className={classes.player}>
        {player.name}
      </div>
    </StrictMode>
  );
};

export default PlayerPanel;
