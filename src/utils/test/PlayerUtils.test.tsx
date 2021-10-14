import { renderHook } from '@testing-library/react-hooks';
import useEvent from '../../hooks/useEvent';

describe('PlayerUtils', () => {
  it('should runs getPlayerName() as expected', async () => {
    const { result } = renderHook(() => useEvent());
    const { current } = result;
    const { event } = current;
  });
});
