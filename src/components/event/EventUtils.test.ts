import { getNewEvent, getNextMatch } from './EventUtils';

test('runs getNewEvent() as expected', async () => {
  const event = getNewEvent();

  expect(event).not.toBeNull();
  expect(event.date).toContain('T');
  expect(event.date).toContain('Z');
  expect(event.players).toHaveLength(6);
});

test('runs getNextMatch() as expected', async () => {
  const event = getNewEvent();

  if (event.players && event.matches) {
    const nextMatch = getNextMatch(event);
    expect(nextMatch).not.toBeNull();
  }
});
