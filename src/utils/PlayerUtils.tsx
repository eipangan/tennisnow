import { DataStore } from 'aws-amplify';
import { Player } from '../models';

/**
 * delete player
 *
 * @param player
 */
export const deletePlayer = async (player: Player) => {
  await DataStore.delete(player);
};

/**
 * get player name
 *
 * @param player
 */
export const getPlayerName = (player: Player, maxLength: number = Number.MAX_VALUE): string | undefined => {
  if (player && player.name) {
    return player.name.substring(0, maxLength);
  }

  return undefined;
};
