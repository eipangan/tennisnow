import { Player, Team, Stats } from '../../models';

/**
 * @deprecated initialize teams
 *
 * @param players players in the event
 */
const getTeams = (players: Player[]): Team[] => {
  if (!players) return [];

  const teams: Team[] = [];
  for (let p = 0; p < players.length; p += 1) {
    for (let np = p; np < players.length; np += 1) {
      if (p !== np) {
        const team = new Team({
          players: [players[p], players[np]],
          stats: new Stats({
            numDraws: 0,
            numLost: 0,
            numMatches: 0,
            numWon: 0,
          }),
        });
        teams.push(team);
      }
    }
  }

  return teams;
};

export default getTeams;
