import { DataStore } from '@aws-amplify/datastore';
import { Match } from '../models';

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

export default saveMatch;
