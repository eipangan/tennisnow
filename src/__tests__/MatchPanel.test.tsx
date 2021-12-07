import { prettyDOM, render } from '@testing-library/react';
import dayjs from 'dayjs';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import '../i18n';
import MatchPanel from '../MatchPanel';
import { Event, EventType, Match, MatchStatus } from '../models';
import { theme } from '../Theme';
import { getNewPlayers } from '../utils/EventUtils';

jest.mock('../PlayerPanel', () => ({
  PlayerPanel: jest.fn(),
}));

jest.mock('aws-amplify');

describe('MatchPanel', () => {
  const event = new Event({
    date: dayjs().add(1, 'hour').startOf('hour').toDate()
      .toISOString(),
    type: EventType.DOUBLES_ROUND_ROBIN,
  });
  const match = new Match({
    eventID: 'eid',
    orderID: 1,
    playerIndices: [0, 1],
    status: MatchStatus.NEW,
  });
  const players = getNewPlayers(event.id, 6);

  beforeAll(() => {
    expect(event).toBeDefined();
    expect(match).toBeDefined();
    expect(players).toBeDefined();
  });

  it('should render without crashing', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <MatchPanel
            match={match}
            players={players}
          />
        </Suspense>
      </ThemeProvider>,
    );

    expect(prettyDOM()).toBeDefined();
  });
});
