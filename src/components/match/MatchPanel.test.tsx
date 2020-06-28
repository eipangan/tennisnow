import { render, screen } from '@testing-library/react';
import { DataStore } from 'aws-amplify';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { Match, MatchStatus } from '../../models';
import { getNewEvent, getNewPlayers, getNextMatch } from '../event/EventUtils';
import { theme } from '../utils/Theme';
import MatchPanel from './MatchPanel';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

const event = getNewEvent();

DataStore.query = jest.fn().mockImplementation(() => [new Match({
  eventID: event.id,
  status: MatchStatus.NEW,
})]);

DataStore.observe = jest.fn().mockImplementation(() => ({
  subscribe: () => ({
    unsubscribe: () => { },
  }),
}));

test('render new without crashing', async () => {
  const players = getNewPlayers(event.id, 6);
  const match = await getNextMatch(event.id, [], players);
  const matches = [match];

  expect(event).toBeDefined();
  expect(players).toBeDefined();
  expect(match).toBeDefined();
  expect(matches).toBeDefined();

  if (match && players) {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Suspense fallback={null}>
            <MatchPanel
              match={match}
              players={players}
            />
          </Suspense>
        </ThemeProvider>
      </BrowserRouter>,
    );

    expect(screen.getAllByRole('button')).toHaveLength(3);
    expect(screen.getByText('vs')).toBeInTheDocument();
  }
});
