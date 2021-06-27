import { renderHook } from '@testing-library/react-hooks';
import useEvent from '../../hooks/useEvent';

describe('Utils', () => {
  it('should runs utils as expected', async () => {
    const { result } = renderHook(() => useEvent());
    const { current } = result;
    const { event } = current;
  });
});
