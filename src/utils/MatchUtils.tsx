import { DataStore } from 'aws-amplify';
import { Match } from '../models';

/**
 * delete match
 *
 * @param match
 */
export const deleteMatch = async (match: Match) => {
  await DataStore.delete(match);
};

/**
 * save match. remove duplicate playerIndices
 *
 * @param match
 */
export const saveMatch = async (match: Match) => {
  if (match.playerIndices) {
    await DataStore.save(Match.copyOf(match, (updated) => {
      if (match.playerIndices) {
        updated.playerIndices = match.playerIndices.filter((item, i, ar) => ar.indexOf(item) === i);
      }
    }));
  }
};
