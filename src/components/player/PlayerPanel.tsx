import { Avatar } from 'antd';
import React, { StrictMode } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { Player } from '../../models';
import { ThemeType } from '../utils/Theme';
import { getPlayerName } from './PlayerUtils';

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
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { player } = props;

  return (
    <StrictMode>
      <Avatar
        className={classes.player}
        size="large"
      >
        {getPlayerName(player)}
      </Avatar>
    </StrictMode>
  );
};

export default PlayerPanel;
