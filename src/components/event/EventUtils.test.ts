import { MatchStatus } from '../../models';
import { generateUUID } from '../utils/Utils';
import { getNewEvent, getNextMatch, getPlayers } from './EventUtils';

test('runs getNewEvent() as expected', async () => {
  const event = getNewEvent();

  expect(event).toBeDefined();
  expect(event).not.toBeNull();

  expect(event.id).toBeDefined();
  expect(event.id).not.toBeNull();
  expect(event.id.length).toBeGreaterThan(32);

  expect(event.date).toContain('T');
  expect(event.date).toContain('Z');

  expect(event.matches).toBeUndefined();
  expect(event.players).toBeUndefined();

  expect(event.owner).toBeUndefined();

  if (event.players) {
    expect(event.players).toHaveLength(6);
  }
});

test('runs getNextMatch() with eventID parameter', async () => {
  const event = getNewEvent();
  const nextMatch = getNextMatch(event.id);

  expect(nextMatch).toBeUndefined();
});

test('runs getNextMatch() with eventID, players parameter', async () => {
  const event = getNewEvent();
  const nextMatch = getNextMatch(event.id, getPlayers(event.id, 6));

  expect(nextMatch).toBeDefined();
  expect(nextMatch).not.toBeNull();

  // id
  expect(nextMatch?.id).toBeDefined();
  expect(nextMatch?.id).not.toBeNull();
  expect(nextMatch?.id.length).toBeGreaterThan(32);

  // eventID
  expect(nextMatch?.eventID).toBeDefined();
  expect(nextMatch?.eventID).not.toBeNull();
  expect(nextMatch?.eventID).toBe(event.id);

  // TODO: playerIndices

  // status
  expect(nextMatch?.status).toBe(MatchStatus.NEW);

  // owner
  expect(nextMatch?.owner).toBeUndefined();
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

  expect(players?.find((player) => player.eventID === generateUUID())).toBeUndefined();
  expect(players?.filter((player) => player.eventID === generateUUID())).toHaveLength(0);

  // index --- required
  expect(players?.find((player) => player.index === 0)).toBeDefined();
  expect(players?.find((player) => player.index === 1)).toBeDefined();
  expect(players?.find((player) => player.index === 2)).toBeDefined();
  expect(players?.find((player) => player.index === 3)).toBeDefined();
  expect(players?.find((player) => player.index === 4)).toBeDefined();
  expect(players?.find((player) => player.index === 5)).toBeDefined();
  expect(players?.find((player) => player.index === 6)).toBeUndefined();

  // name
  expect(players?.find((player) => player.name === '')).toBeDefined();
  expect(players?.filter((player) => player.name === '')).toHaveLength(defaultNumPlayers);
  expect(players?.find((player) => player.name === '1')).toBeUndefined();

  if (players) {
    players.forEach((player) => {
      expect(player).toBeDefined();
      expect(player).not.toBeNull();

      expect(player.id).toBeDefined();
      expect(player.id).not.toBeNull();
      expect(player.id.length).toBeGreaterThan(32);
    });
  }
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

  expect(players?.find((player) => player.eventID === generateUUID())).toBeUndefined();
  expect(players?.filter((player) => player.eventID === generateUUID())).toHaveLength(0);

  // index --- required
  expect(players?.find((player) => player.index === 0)).toBeDefined();
  expect(players?.find((player) => player.index === 1)).toBeDefined();
  expect(players?.find((player) => player.index === 2)).toBeDefined();
  expect(players?.find((player) => player.index === 3)).toBeDefined();
  expect(players?.find((player) => player.index === 4)).toBeUndefined();

  // name
  expect(players?.find((player) => player.name === '')).toBeDefined();
  expect(players?.filter((player) => player.name === '')).toHaveLength(numPlayers);
  expect(players?.find((player) => player.name === '1')).toBeUndefined();
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

  expect(players?.find((player) => player.eventID === generateUUID())).toBeUndefined();
  expect(players?.filter((player) => player.eventID === generateUUID())).toHaveLength(0);

  // index --- required
  expect(players?.find((player) => player.index === 0)).toBeDefined();
  expect(players?.find((player) => player.index === 1)).toBeDefined();
  expect(players?.find((player) => player.index === 2)).toBeDefined();
  expect(players?.find((player) => player.index === 3)).toBeDefined();
  expect(players?.find((player) => player.index === 4)).toBeUndefined();

  // name
  expect(players?.find((player) => player.name === '')).toBeDefined();
  expect(players?.filter((player) => player.name === '')).toHaveLength(1);

  expect(players?.find((player) => player.name === 'P1')).toBeDefined();
  expect(players?.filter((player) => player.name === 'P1')).toHaveLength(1);

  expect(players?.find((player) => player.name === 'P2')).toBeDefined();
  expect(players?.filter((player) => player.name === 'P2')).toHaveLength(1);

  expect(players?.find((player) => player.name === 'P3')).toBeDefined();
  expect(players?.filter((player) => player.name === 'P3')).toHaveLength(1);

  expect(players?.find((player) => player.name === 'P4')).toBeUndefined();
});
