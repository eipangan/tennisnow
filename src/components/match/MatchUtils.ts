import { Match, Team, MatchStatus } from '../../models';

const isValidMatch = (t1: Team, t2: Team): boolean => {
  let isValid = true;

  t1.players.forEach((t1player) => {
    t2.players.forEach((t2player) => {
      if (t1player === t2player) {
        isValid = false;
      }
    });
  });

  return isValid;
};

/**
 * @deprecated initialize matches
 *
 * @param teams number of players
 */
const getMatches = (teams: Team[]): Match[] => {
  const matches: Match[] = [];
  for (let t = 0; t < teams.length; t += 1) {
    for (let nt = t; nt < teams.length; nt += 1) {
      if (isValidMatch(teams[t], teams[nt])) {
        const match = new Match({
          teams: [teams[t], teams[nt]],
          status: MatchStatus.NEW,
        });
        matches.push(match);
      }
    }
  }
  return matches;
};

export default getMatches;
