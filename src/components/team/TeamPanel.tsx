import React, { StrictMode } from 'react';
import { Player, Team } from '../../models';
import PlayerPanel from '../player/PlayerPanel';

/**
 * initialize teams
 *
 * @param players players in the event
 */
export const getTeams = (players: Player[]): Team[] => {
  if (!players) return [];

  const teams: Team[] = [];
  for (let p = 0; p < players.length; p += 1) {
    for (let np = p; np < players.length; np += 1) {
      if (p !== np) {
        const team = new Team({
          players: [players[p], players[np]],
        });
        teams.push(team);
      }
    }
  }

  return teams;
};

/**
 * TeamProps
 */
type TeamProps = {
  team: Team;
  className?: string;
};

/**
 * Team
 *
 * @param props
 */
const TeamPanel = (props: TeamProps): JSX.Element => {
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
