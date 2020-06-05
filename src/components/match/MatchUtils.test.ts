import getPlayers from '../player/PlayerUtils';
import getTeams from '../team/TeamUtils';
import getMatches from './MatchUtils';

test('runs as expected', async () => {
  const players = getPlayers(6);
  const teams = getTeams(players);
  const matches = getMatches(teams);

  expect(matches).toHaveLength(45);
});
