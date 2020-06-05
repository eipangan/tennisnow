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
