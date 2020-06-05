import { getPlayers } from '../player/PlayerUtils';
import getTeams from '../team/TeamUtils';

test('runs as expected', async () => {
  const players = getPlayers(6);
  const teams = getTeams(players);
});
