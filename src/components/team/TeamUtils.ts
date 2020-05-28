import { Player, Team } from '../../models';

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

export default getTeams;
