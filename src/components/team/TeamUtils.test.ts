import getPlayers from '../player/PlayerUtils';
import getTeams from './TeamUtils';

test('runs as expected', async () => {
  const players = getPlayers(6);
  const teams = getTeams(players);

  expect(teams).toHaveLength(15);
});
