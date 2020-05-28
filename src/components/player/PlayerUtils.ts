import { Player } from '../../models';

/**
 * initialize players
 *
 * @param numPlayers number of players
 */
export const getPlayers = (numPlayers: number): Player[] => {
  const players: Player[] = [];

  for (let i = 0; i < numPlayers; i += 1) {
    players.push(new Player({
      name: '',
    }));
  }

  return players;
};

export default getPlayers;
