import React, { StrictMode } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { Player } from './models';
import { ThemeType } from './Theme';
import { getPlayerName } from './PlayerUtils';

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
  player: Player | undefined;
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

  if (!player) return <></>;

  return (
    <StrictMode>
      <div
        className={classes.player}
      >
        {getPlayerName(player)}
      </div>
    </StrictMode>
  );
};

export default PlayerPanel;
