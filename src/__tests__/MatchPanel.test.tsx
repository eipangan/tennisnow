import { act, prettyDOM, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import dayjs from 'dayjs';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import useEvent from '../hooks/useEvent';
import '../i18n';
import MatchPanel from '../MatchPanel';
import { Match, MatchStatus } from '../models';
import { theme } from '../Theme';
import { getNewPlayers } from '../utils/EventUtils';

jest.mock('../PlayerPanel', () => ({
  PlayerPanel: jest.fn(),
}));

jest.mock('aws-amplify');

describe('MatchPanel', () => {
  describe('invalid matchID', () => {
    it('should render without crashing', async () => {
      render(
        <ThemeProvider theme={theme}>
          <Suspense fallback={null}>
            <MatchPanel matchID="" />
          </Suspense>
        </ThemeProvider>,
      );

      expect(prettyDOM()).toBeDefined();
    });

    it('should render without crashing', async () => {
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

    it('should render without crashing', async () => {
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

  describe('valid match', () => {
    const match = new Match({
      eventID: 'eid',
      createdTime: dayjs().toDate().toISOString(),
      playerIndices: [0, 1],
      status: MatchStatus.NEW,
    });

    beforeAll(() => {
      const { result } = renderHook(() => useEvent());
      const { current } = result;
      const { event } = current;

      const players = getNewPlayers(event.id, 6);

      expect(event).toBeDefined();
      expect(players).toBeDefined();
    });

    it('should render without crashing', async () => {
      await act(async () => {
        render(
          <ThemeProvider theme={theme}>
            <Suspense fallback={null}>
              <MatchPanel matchID={match.id} />
            </Suspense>
          </ThemeProvider>,
        );
      });

      expect(prettyDOM()).toBeDefined();
    });
  });
});
