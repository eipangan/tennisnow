import { renderHook } from '@testing-library/react-hooks';
import { DataStore } from 'aws-amplify';
import { getNewPlayers, useEvent } from '../EventUtils';
import { EventType, Match, MatchStatus } from '../models';

const { event } = useEvent();

DataStore.query = jest.fn().mockImplementation(() => [new Match({
  eventID: event.id,
  status: MatchStatus.NEW,
})]);

DataStore.observe = jest.fn().mockImplementation(() => ({
  subscribe: () => ({
    unsubscribe: () => { },
  }),
}));

/**
 * getPlayers() tests
 */

test('runs getPlayers() with just eventID parameter', () => {
  const defaultNumPlayers = 6;
  const players = getNewPlayers(event.id);

  // players
  expect(players).toBeDefined();
  expect(players).not.toBeNull();
  expect(players).toHaveLength(defaultNumPlayers);

  // eventID --- required
  expect(players?.find((player) => player.eventID === event.id)).toBeDefined();
  expect(players?.filter((player) => player.eventID === event.id)).toHaveLength(defaultNumPlayers);

  expect(players?.find((player) => player.eventID === 'ABC')).toBeUndefined();
  expect(players?.filter((player) => player.eventID === 'DEF')).toHaveLength(0);

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

test('runs getPlayers() with eventID, numPlayers=4 parameter', () => {
  const numPlayers = 4;
  const players = getNewPlayers(event.id, numPlayers);

  // players
  expect(players).toBeDefined();
  expect(players).not.toBeNull();
  expect(players).toHaveLength(numPlayers);

  // eventID --- required
  expect(players?.find((player) => player.eventID === event.id)).toBeDefined();
  expect(players?.filter((player) => player.eventID === event.id)).toHaveLength(numPlayers);

  expect(players?.find((player) => player.eventID === 'ABC')).toBeUndefined();
  expect(players?.filter((player) => player.eventID === 'DEF')).toHaveLength(0);

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

test('runs getPlayers() with eventID, numPlayers=4, playersNames parameter', () => {
  const numPlayers = 4;
  const playerNames = ['P1', 'P2', 'P3'];
  const players = getNewPlayers(event.id, numPlayers, playerNames);

  // players
  expect(players).toBeDefined();
  expect(players).not.toBeNull();
  expect(players).toHaveLength(numPlayers);

  // eventID --- required
  expect(players?.find((player) => player.eventID === event.id)).toBeDefined();
  expect(players?.filter((player) => player.eventID === event.id)).toHaveLength(numPlayers);

  expect(players?.find((player) => player.eventID === 'ABC')).toBeUndefined();
  expect(players?.filter((player) => player.eventID === 'DEF')).toHaveLength(0);

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

test('test useEvent() with empty parameter', () => {
  const { result } = renderHook(() => useEvent());

  // check event
  expect(result.current.event).toBeDefined();
  expect(result.current.event).not.toBeNull();

  expect(result.current.event.id).toBeDefined();
  expect(result.current.event.id).not.toBeNull();
  expect(result.current.event.id.length).toBeGreaterThan(32);

  expect(result.current.event.date).toBeDefined();
  expect(result.current.event.date).not.toBeNull();
  expect(result.current.event.date).toContain('T');
  expect(result.current.event.date).toContain('Z');

  expect(result.current.event.type).toBeDefined();
  expect(result.current.event.type).toBe(EventType.GENERIC_EVENT);

  // check event - initially undefined parameters
  expect(result.current.event.place).toBeUndefined();
  expect(result.current.event.summary).toBeUndefined();
  expect(result.current.event.details).toBeUndefined();
  expect(result.current.event.matches).toBeUndefined();
  expect(result.current.event.players).toBeUndefined();
  expect(result.current.event.owner).toBeUndefined();

  // check getNextMatch
  expect(result.current.getNextMatch).toBeDefined();
});