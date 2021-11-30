import { act, prettyDOM, render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { Event, EventType, Match, MatchStatus } from '../models';
import PlayersSummary from '../PlayersSummary';
import { theme } from '../Theme';
import { getNewPlayers } from '../utils/EventUtils';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('PlayersSummary', () => {
  const event = new Event({
    date: dayjs().add(1, 'hour').startOf('hour').toDate()
      .toISOString(),
    type: EventType.DOUBLES_ROUND_ROBIN,
  });
  const players = getNewPlayers(event.id, 6);
  const matches = [new Match({
    eventID: 'eid',
    orderID: 1,
    playerIndices: [0, 1],
    status: MatchStatus.NEW,
  }), new Match({
    eventID: 'eid',
    orderID: 2,
    playerIndices: [1, 0],
    status: MatchStatus.NEW,
  })];

  beforeAll(() => {
    window.matchMedia = window.matchMedia || (() => ({
      matches: false,
      addListener() { },
      removeListener() { },
    }));
  });

  it('should render without crashing', async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={theme}>
          <Suspense fallback={null}>
            <PlayersSummary
              matches={matches}
              players={players}
            />
          </Suspense>
        </ThemeProvider>,
      );
    });

    expect(prettyDOM()).toBeDefined();

    expect(screen.getByText('player')).toBeInTheDocument();
    expect(screen.getByText('won')).toBeInTheDocument();
    expect(screen.getByText('lost')).toBeInTheDocument();
    expect(screen.getByText('draw')).toBeInTheDocument();
  });
});
