import React, { StrictMode } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { Player } from './models';
import { ThemeType } from './Theme';
import { getPlayerName } from './utils/PlayerUtils';

// initialize styles
const useStyles = createUseStyles((theme: ThemeType) => ({
  player: {
    backgroundColor: 'transparent',
  },
}));

/**
 * PlayerPanelProps
 */
type PlayerPanelProps = {
  player: Player | Player[] | undefined;
};

/**
 * PlayerPanel
 *
 * @param props
 */
const PlayerPanel = (props: PlayerPanelProps) => {
  const theme = useTheme<ThemeType>();
  const classes = useStyles({ theme });

  const { player } = props;

  if (!player) return <div />;

  return (
    <StrictMode>
      <div
        className={classes.player}
      >
        {getPlayerName(player, 9)}
      </div>
    </StrictMode>
  );
};

export default PlayerPanel;
