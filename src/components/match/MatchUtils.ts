import { DataStore } from 'aws-amplify';
import { Match } from '../../models';

/**
 * delete match
 *
 * @param myMatch
 */
export const deleteMatch = async (myMatch: Match) => {
  console.log('deleteMatch', myMatch);
  await DataStore.delete(myMatch);
};

/**
 * save match
 *
 * @param myMatch
 */
export const saveMatch = async (myMatch: Match) => {
  console.log('saveMatch', myMatch);
  await DataStore.save(myMatch);
};
