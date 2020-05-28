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
