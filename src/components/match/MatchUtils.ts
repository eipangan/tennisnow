import { DataStore } from 'aws-amplify';
import { Match } from '../../models';

/**
 * saveMatch
 *
 * @param myMatch
 */
// eslint-disable-next-line import/prefer-default-export
export const saveMatch = async (myMatch: Match) => {
  console.log('saveMatch', myMatch);
  await DataStore.save(myMatch);
};
