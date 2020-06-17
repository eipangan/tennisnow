import { Player } from '../../models';

/**
 * get player name
 *
 * @param player
 */
export const getPlayerName = (player: Player, maxLength: number = Number.MAX_VALUE): string | undefined => {
  if (player && player.name) return player.name.substring(0, maxLength);
  return undefined;
};

export default getPlayerName;
