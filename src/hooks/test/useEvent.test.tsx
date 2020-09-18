import { renderHook } from '@testing-library/react-hooks';
import { EventType } from '../../models';
import useEvent from '../useEvent';

test('test useEvent() with empty parameter', () => {
  const { result } = renderHook(() => useEvent());
  const { current } = result;
  const { event, getNextMatch } = current;

  // check event
  expect(event).toBeDefined();
  expect(event).not.toBeNull();

  expect(event.id).toBeDefined();
  expect(event.id).not.toBeNull();
  expect(event.id.length).toBeGreaterThan(32);

  expect(event.date).toBeDefined();
  expect(event.date).not.toBeNull();
  expect(event.date).toContain('T');
  expect(event.date).toContain('Z');

  expect(event.type).toBeDefined();
  expect(event.type).toBe(EventType.GENERIC_EVENT);

  // check event - initially undefined parameters
  expect(event.place).toBeUndefined();
  expect(event.summary).toBeUndefined();
  expect(event.details).toBeUndefined();
  expect(event.matches).toBeUndefined();
  expect(event.players).toBeUndefined();
  expect(event.owner).toBeUndefined();

  // check getNextMatch
  expect(getNextMatch).toBeDefined();
});
