import { Player, Stats } from '../../models';

/**
 * initialize players
 *
 * @param numPlayers number of players
 */
export const getPlayers = (numPlayers: number, playerNames?: string[]): Player[] => {
  const players: Player[] = [];

  for (let i = 0; i < numPlayers; i += 1) {
    players.push(new Player({
      userid: '',
      name: playerNames ? playerNames[i] : '',
      stats: new Stats({
        numDraws: 0,
        numLost: 0,
        numMatches: 0,
        numWon: 0,
      }),
    }));
  }

  return players;
};

export default getPlayers;
