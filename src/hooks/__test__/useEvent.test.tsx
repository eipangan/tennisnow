import { renderHook } from '@testing-library/react-hooks';
import { EventType } from '../../models';
import useEvent from '../useEvent';

it('should work with empty parameter', async () => {
  const { result } = renderHook(() => useEvent());
  const { current } = result;
  const { event } = current;

  // check event
  expect(event).toBeDefined();
  expect(event).not.toBeNull();

  expect(event.id).toBeDefined();
  expect(event.id).not.toBeNull();
  expect(event.id.length).toBe(36);

  expect(event.date).toBeDefined();
  expect(event.date).not.toBeNull();
  expect(event.date).toContain('T');
  expect(event.date).toContain('Z');

  expect(event.type).toBeDefined();
  expect(event.type).toBe(EventType.SINGLES_ROUND_ROBIN);

  // check event - initially undefined parameters
  expect(event.place).toBeUndefined();
  expect(event.summary).toBeUndefined();
  expect(event.details).toBeUndefined();
  expect(event.matches).toBeUndefined();
  expect(event.players).toBeUndefined();
  expect(event.owner).toBeUndefined();
});