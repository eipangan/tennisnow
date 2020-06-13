import { DataStore } from 'aws-amplify';
import { Match } from '../../models';

/**
 * delete match
 *
 * @param myMatch
 */
export const deleteMatch = async (myMatch: Match) => {
  await DataStore.delete(myMatch);
};

/**
 * save match
 *
 * @param myMatch
 */
export const saveMatch = async (myMatch: Match) => {
  await DataStore.save(myMatch);
};
