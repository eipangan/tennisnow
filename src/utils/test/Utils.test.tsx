import { renderHook } from '@testing-library/react-hooks';
import useEvent from '../../hooks/useEvent';

test('runs utils as expected', () => {
  const { result } = renderHook(() => useEvent());
  const { current } = result;
  const { event } = current;
});
