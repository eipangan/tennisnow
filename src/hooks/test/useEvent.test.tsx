import { renderHook } from '@testing-library/react-hooks';
import { DataStore } from 'aws-amplify';
import { EventType, Match, MatchStatus } from '../../models';
import useEvent from '../useEvent';

test('test useEvent() with empty parameter', () => {
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
