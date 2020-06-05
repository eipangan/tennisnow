import { Player, Stats } from '../../models';

/**
 * get player name
 *
 * @param player
 */
export const getPlayerName = (player: Player) : string => {
  if (player.name) return player.name.substring(0, 3);
  return String(player.index);
};

/**
 * initialize players
 *
 * @param numPlayers number of players
 */
export const getPlayers = (numPlayers: number, playerNames?: string[]): Player[] => {
  const players: Player[] = [];

  for (let i = 0; i < numPlayers; i += 1) {
    players.push(new Player({
      index: i,
      userid: [],
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
