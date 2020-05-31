import { Avatar } from 'antd';
import React, { StrictMode } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { Player } from '../../models';
import { ThemeType } from '../utils/Theme';

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  player: {
    color: 'black',
    backgroundColor: theme.baseColor,
  },
}));

/**
 * PlayerPanelProps
 */
type PlayerPanelProps = {
  player: Player;
};

/**
 * PlayerPanel
 *
 * @param props
 */
const PlayerPanel = (props: PlayerPanelProps): JSX.Element => {
  const { player } = props;

  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <StrictMode>
      <Avatar
        className={classes.player}
        size="large"
      >
        {player.name}
      </Avatar>
    </StrictMode>
  );
};

export default PlayerPanel;
