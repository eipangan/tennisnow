import { DataStore } from 'aws-amplify';
import { Match } from '../../models';

/**
 * delete match
 *
 * @param match
 */
export const deleteMatch = async (match: Match) => {
  await DataStore.delete(match);
};

/**
 * save match
 *
 * @param match
 */
export const saveMatch = async (match: Match) => {
  await DataStore.save(Match.copyOf(match, (updated) => {
    updated.playerIndices = match.playerIndices?.slice(0, 2);
  }));
};