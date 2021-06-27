import { renderHook } from '@testing-library/react-hooks';
import useEvent from '../../hooks/useEvent';

describe('MatchUtils', () => {
  it('should run deleteMatch() as expected', async () => {
    const { result } = renderHook(() => useEvent());
    const { current } = result;
    const { event } = current;
  });

  it('should run saveMatch() as expected', async () => {
    const { result } = renderHook(() => useEvent());
    const { current } = result;
    const { event } = current;
  });
});
