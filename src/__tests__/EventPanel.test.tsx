import { prettyDOM, render } from '@testing-library/react';
import dayjs from 'dayjs';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import EventPanel from '../EventPanel';
import { Event, EventType, Match, MatchStatus } from '../models';
import { theme } from '../Theme';
import { getNewPlayers } from '../utils/EventUtils';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

window.matchMedia = window.matchMedia || (() => ({
  matches: false,
  addListener() { },
  removeListener() { },
}));

describe('EventPanel', () => {
  const event = new Event({
    date: dayjs().add(1, 'hour').startOf('hour').toDate()
      .toISOString(),
    type: EventType.DOUBLES_ROUND_ROBIN,
  });
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
  const players = getNewPlayers(event.id, 6);

  beforeAll(() => {
    expect(event).toBeDefined();
    expect(matches).toBeDefined();
    expect(players).toBeDefined();
  });

  it('should render without crashing', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <EventPanel
            event={event}
            matches={matches}
            players={players}
          />
        </Suspense>
      </ThemeProvider>,
    );

    expect(prettyDOM()).toBeDefined();
  });
});
