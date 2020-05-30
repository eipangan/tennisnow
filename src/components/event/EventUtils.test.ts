import getNewEvent from './EventUtils';

test('runs as expected', async () => {
  const event = getNewEvent();

  expect(event).not.toBeNull();

  expect(event.date).toContain('T');
  expect(event.date).toContain('Z');
  expect(event.numPlayers).toBe(6);
  expect(event.players).toHaveLength(6);
  expect(event.teams).toHaveLength(15);
});
