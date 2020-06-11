import { getNewEvent, getNextMatch, getPlayers } from './EventUtils';
import { generateUUID } from '../utils/Utils';

test('runs getNewEvent() as expected', async () => {
  const event = getNewEvent();

  expect(event).not.toBeNull();
  expect(event.date).toContain('T');
  expect(event.date).toContain('Z');

  if (event.players) {
    expect(event.players).toHaveLength(6);
  }
});

test('runs getNextMatch() as expected', async () => {
  const event = getNewEvent();

  if (event.players && event.matches) {
    const nextMatch = getNextMatch(event);
    expect(nextMatch).not.toBeNull();
  }
});

test('runs getPlayers() with eventID parameter', async () => {
  const event = getNewEvent();
  const defaultNumPlayers = 6;
  const players = getPlayers(event.id);

  // players
  expect(players).toBeDefined();
  expect(players).not.toBeNull();
  expect(players).toHaveLength(defaultNumPlayers);

  // eventID --- required
  expect(players?.find((player) => player.eventID === event.id)).toBeDefined();
  expect(players?.filter((player) => player.eventID === event.id)).toHaveLength(defaultNumPlayers);

  expect(players?.find((player) => player.eventID === generateUUID())).not.toBeDefined();
  expect(players?.filter((player) => player.eventID === generateUUID())).toHaveLength(0);

  // index --- required
  expect(players?.find((player) => player.index === 0)).toBeDefined();
  expect(players?.find((player) => player.index === 1)).toBeDefined();
  expect(players?.find((player) => player.index === 2)).toBeDefined();
  expect(players?.find((player) => player.index === 3)).toBeDefined();
  expect(players?.find((player) => player.index === 4)).toBeDefined();
  expect(players?.find((player) => player.index === 5)).toBeDefined();
  expect(players?.find((player) => player.index === 6)).not.toBeDefined();

  // name
  expect(players?.find((player) => player.name === '')).toBeDefined();
  expect(players?.filter((player) => player.name === '')).toHaveLength(defaultNumPlayers);
  expect(players?.find((player) => player.name === '1')).not.toBeDefined();
});

test('runs getPlayers() with eventID, numPlayers=4 parameter', async () => {
  const event = getNewEvent();
  const numPlayers = 4;
  const players = getPlayers(event.id, numPlayers);

  // players
  expect(players).toBeDefined();
  expect(players).not.toBeNull();
  expect(players).toHaveLength(numPlayers);

  // eventID --- required
  expect(players?.find((player) => player.eventID === event.id)).toBeDefined();
  expect(players?.filter((player) => player.eventID === event.id)).toHaveLength(numPlayers);

  expect(players?.find((player) => player.eventID === generateUUID())).not.toBeDefined();
  expect(players?.filter((player) => player.eventID === generateUUID())).toHaveLength(0);

  // index --- required
  expect(players?.find((player) => player.index === 0)).toBeDefined();
  expect(players?.find((player) => player.index === 1)).toBeDefined();
  expect(players?.find((player) => player.index === 2)).toBeDefined();
  expect(players?.find((player) => player.index === 3)).toBeDefined();
  expect(players?.find((player) => player.index === 4)).not.toBeDefined();

  // name
  expect(players?.find((player) => player.name === '')).toBeDefined();
  expect(players?.filter((player) => player.name === '')).toHaveLength(numPlayers);
  expect(players?.find((player) => player.name === '1')).not.toBeDefined();
});

test('runs getPlayers() with eventID, numPlayers=4, playersNames parameter', async () => {
  const event = getNewEvent();
  const numPlayers = 4;
  const playerNames = ['P1', 'P2', 'P3'];
  const players = getPlayers(event.id, numPlayers, playerNames);

  // players
  expect(players).toBeDefined();
  expect(players).not.toBeNull();
  expect(players).toHaveLength(numPlayers);

  // eventID --- required
  expect(players?.find((player) => player.eventID === event.id)).toBeDefined();
  expect(players?.filter((player) => player.eventID === event.id)).toHaveLength(numPlayers);

  expect(players?.find((player) => player.eventID === generateUUID())).not.toBeDefined();
  expect(players?.filter((player) => player.eventID === generateUUID())).toHaveLength(0);

  // index --- required
  expect(players?.find((player) => player.index === 0)).toBeDefined();
  expect(players?.find((player) => player.index === 1)).toBeDefined();
  expect(players?.find((player) => player.index === 2)).toBeDefined();
  expect(players?.find((player) => player.index === 3)).toBeDefined();
  expect(players?.find((player) => player.index === 4)).not.toBeDefined();

  // name
  expect(players?.find((player) => player.name === '')).toBeDefined();
  expect(players?.filter((player) => player.name === '')).toHaveLength(1);

  expect(players?.find((player) => player.name === 'P1')).toBeDefined();
  expect(players?.filter((player) => player.name === 'P1')).toHaveLength(1);

  expect(players?.find((player) => player.name === 'P2')).toBeDefined();
  expect(players?.filter((player) => player.name === 'P2')).toHaveLength(1);

  expect(players?.find((player) => player.name === 'P3')).toBeDefined();
  expect(players?.filter((player) => player.name === 'P3')).toHaveLength(1);

  expect(players?.find((player) => player.name === 'P4')).not.toBeDefined();
});
