import { Player } from '../../models';

/**
 * get player name
 *
 * @param player
 */
export const getPlayerName = (player: Player, maxLength: number = Number.MAX_VALUE) : string => {
  if (player.name) return player.name.substring(0, maxLength);
  return String(player.index + 1);
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
      name: playerNames ? playerNames[i] : '',
    }));
  }

  return players;
};
