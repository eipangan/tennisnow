import { DataStore } from 'aws-amplify';
import { getNewEvent, getNewPlayers, getNextMatch } from '../EventUtils';
import { Event, EventType, Match, MatchStatus, Player } from '../models';
import { generateUUID } from '../Utils';

const event = getNewEvent();

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
 * getNewEvent() tests
 */

test('runs getNewEvent() as expected', () => {
  expect(event).toBeDefined();
  expect(event).not.toBeNull();

  expect(event.id).toBeDefined();
  expect(event.id).not.toBeNull();
  expect(event.id.length).toBeGreaterThan(32);

  expect(event.date).toBeDefined();
  expect(event.date).not.toBeNull();
  expect(event.date).toContain('T');
  expect(event.date).toContain('Z');

  // initially undefined parameters
  expect(event.place).toBeUndefined();
  expect(event.type).toBeUndefined();
  expect(event.summary).toBeUndefined();
  expect(event.details).toBeUndefined();
  expect(event.matches).toBeUndefined();
  expect(event.players).toBeUndefined();
  expect(event.owner).toBeUndefined();
});

/**
 * getNextMatch() tests
 */

test('runs getNextMatch() with only eventID parameter', async () => {
  const myEvent = Event.copyOf(event, (updated) => {
    updated.type = EventType.SINGLES_ROUND_ROBIN;
  });

  const nextMatch = await getNextMatch(myEvent);

  // should be undefined because myEvent doesn't have players
  expect(nextMatch).toBeUndefined();
});

test('runs getNextMatch() for SINGLES_ROUND_ROBIN', async () => {
  const myEvent = Event.copyOf(event, (updated) => {
    updated.type = EventType.SINGLES_ROUND_ROBIN;
  });

  let nextMatch = await getNextMatch(myEvent, [], getNewPlayers(myEvent.id, 1));
  expect(nextMatch).toBeUndefined();

  nextMatch = await getNextMatch(myEvent, [], getNewPlayers(myEvent.id, 2));
  expect(nextMatch).toBeDefined();

  nextMatch = await getNextMatch(myEvent, [], getNewPlayers(myEvent.id, 3));
  expect(nextMatch).toBeDefined();
});

test('runs getNextMatch() for SWITCH_DOUBLES_ROUND_ROBIN', async () => {
  const myEvent = Event.copyOf(event, (updated) => {
    updated.type = EventType.SWITCH_DOUBLES_ROUND_ROBIN;
  });

  let numPlayers: number;
  let newPlayers: Player[];
  let nextMatch: Match | undefined;

  numPlayers = 1;
  newPlayers = getNewPlayers(myEvent.id, numPlayers);
  nextMatch = await getNextMatch(myEvent, [], newPlayers);
  expect(nextMatch).toBeUndefined();

  numPlayers = 2;
  newPlayers = getNewPlayers(myEvent.id, numPlayers);
  nextMatch = await getNextMatch(myEvent, [], newPlayers);
  // expect(nextMatch).toBeUndefined();

  numPlayers = 3;
  newPlayers = getNewPlayers(myEvent.id, numPlayers);
  nextMatch = await getNextMatch(myEvent, [], newPlayers);
  // expect(nextMatch).toBeUndefined();

  numPlayers = 4;
  newPlayers = getNewPlayers(myEvent.id, numPlayers);
  nextMatch = await getNextMatch(myEvent, [], newPlayers);
  expect(nextMatch).toBeDefined();

  numPlayers = 5;
  newPlayers = getNewPlayers(myEvent.id, numPlayers);
  nextMatch = await getNextMatch(myEvent, [], newPlayers);
  expect(nextMatch).toBeDefined();
  expect(nextMatch).not.toBeNull();
});

test('runs getNextMatch() with eventID, matches[0], players[4] parameters', async () => {
  const myEvent = Event.copyOf(event, (updated) => {
    updated.type = EventType.SWITCH_DOUBLES_ROUND_ROBIN;
  });
  const matches: Match[] = [];
  const players = getNewPlayers(event.id, 4);

  // round 1
  {
    const nextMatch = await getNextMatch(myEvent, matches, players);
    if (nextMatch) {
      expect(nextMatch).toBeDefined();
      expect(nextMatch.playerIndices).toBeDefined();
      expect(nextMatch.playerIndices?.length).toBe(2);
      if (nextMatch.playerIndices) {
        expect(nextMatch.playerIndices[0]).toBe(0);
        expect(nextMatch.playerIndices[1]).toBe(1);
      }
      matches.push(nextMatch);
    }
  }

  // round 2
  {
    const nextMatch = await getNextMatch(myEvent, matches, players);
    if (nextMatch) {
      expect(nextMatch).toBeDefined();
      expect(nextMatch.playerIndices).toBeDefined();
      expect(nextMatch.playerIndices?.length).toBe(2);
      if (nextMatch.playerIndices) {
        expect(nextMatch.playerIndices[0]).toBe(2);
        expect(nextMatch.playerIndices[1]).toBe(3);
      }
      matches.push(nextMatch);
    }
  }
});

test('runs getNextMatch() with eventID, matches[1], players[6], parameter', async () => {
  const myEvent = Event.copyOf(event, (updated) => {
    updated.type = EventType.SWITCH_DOUBLES_ROUND_ROBIN;
  });
  const match = new Match({
    eventID: event.id,
    playerIndices: [0, 1],
  });
  const matches: Match[] = [match];
  const players = getNewPlayers(event.id, 6);
  const nextMatch = await getNextMatch(myEvent, matches, players);

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

  // playerIndices
  expect(nextMatch?.playerIndices).toBeDefined();
  expect(nextMatch?.playerIndices).not.toBeNull();
  expect(nextMatch?.playerIndices?.length).toBe(2);

  // status
  expect(nextMatch?.status).toBe(MatchStatus.NEW);

  // owner
  expect(nextMatch?.owner).toBeUndefined();
});

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
