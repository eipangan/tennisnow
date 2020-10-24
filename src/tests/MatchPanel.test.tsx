import { prettyDOM, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import useEvent from '../hooks/useEvent';
import '../i18n';
import MatchPanel from '../MatchPanel';
import { theme } from '../Theme';
import { getNewPlayers } from '../utils/EventUtils';

jest.mock('../PlayerPanel', () => ({
  PlayerPanel: jest.fn(),
}));

describe('MatchPanel', () => {
  describe('empty matchID', () => {
    it('should render without crashing', () => {
      render(
        <ThemeProvider theme={theme}>
          <Suspense fallback={null}>
            <MatchPanel matchID="" />
          </Suspense>
        </ThemeProvider>,
      );

      expect(prettyDOM()).toBeDefined();
    });
  });

  describe('invalid matchID', () => {
    it('should render without crashing', () => {
      render(
        <ThemeProvider theme={theme}>
          <Suspense fallback={null}>
            <MatchPanel matchID="ABC" />
          </Suspense>
        </ThemeProvider>,
      );

      expect(prettyDOM()).toBeDefined();
    });
  });

  describe('valid matchID', () => {
    beforeAll(() => {
      const { result } = renderHook(() => useEvent());
      const { current } = result;
      const { event } = current;

      const players = getNewPlayers(event.id, 6);

      expect(event).toBeDefined();
      expect(players).toBeDefined();
    });
  });
});
