import { getMatches } from './MatchUtils';
import getPlayers from '../player/PlayerUtils';
import getTeams from '../team/TeamUtils';

test('runs as expected', async () => {
  const players = getPlayers(6);
  const teams = getTeams(players);
  const matches = getMatches(teams);

  expect(matches).toHaveLength(45);

  console.log(matches);
});
