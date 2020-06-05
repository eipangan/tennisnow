import { getNewEvent, getNextMatch } from './EventUtils';

test('runs getNewEvent() as expected', async () => {
  const event = getNewEvent();

  expect(event).not.toBeNull();
  expect(event.date).toContain('T');
  expect(event.date).toContain('Z');
  expect(event.players).toHaveLength(6);
  expect(event.matches).toHaveLength(1);
});

test('runs getNextMatch() as expected', async () => {
  const event = getNewEvent();
  const nextMatch = getNextMatch(event.players, event.matches);

  expect(nextMatch).not.toBeNull();
});
