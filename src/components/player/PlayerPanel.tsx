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
  className?: string;
};

/**
 * PlayerPanel
 *
 * @param props
 */
const PlayerPanel = (props: PlayerPanelProps): JSX.Element => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { player, className } = props;

  return (
    <StrictMode>
      <div
        className={className}
        onKeyDown={() => { }}
        role="button"
        tabIndex={0}
      >
        <Avatar
          className={classes.player}
          size="large"
        >
          {getPlayerName(player)}
        </Avatar>
      </div>
    </StrictMode>
  );
};

export default PlayerPanel;
