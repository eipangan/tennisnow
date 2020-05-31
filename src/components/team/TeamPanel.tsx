import React, { StrictMode } from 'react';
import { Team } from '../../models';
import PlayerPanel from '../player/PlayerPanel';

/**
 * TeamPanelProps
 */
type TeamPanelProps = {
  team: Team;
  className?: string;
};

/**
 * TeamPanel
 *
 * @param props
 */
const TeamPanel = (props: TeamPanelProps): JSX.Element => {
  const { team, className } = props;

  return (
    <StrictMode>
      <div
        className={className}
        onKeyDown={() => { }}
        role="button"
        tabIndex={0}
      >
        {team.players && team.players.map((player, index) => (
          <PlayerPanel
            key={index.toString()}
            player={player}
          />
        ))}
      </div>
    </StrictMode>
  );
};

export default TeamPanel;
