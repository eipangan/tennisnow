import { render } from '@testing-library/react';
import { DataStore } from 'aws-amplify';
import React, { Suspense } from 'react';
import { act } from 'react-dom/test-utils';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { getNewEvent, getNewPlayers, getNextMatch } from '../EventUtils';
import MatchPanel from '../MatchPanel';
import { Match, MatchStatus } from '../models';
import { theme } from '../Theme';

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
  const match = await getNextMatch(event, [], players);

  expect(event).toBeDefined();
  expect(players).toBeDefined();
  expect(match).toBeDefined();

  if (match) {
    await act(async () => {
      render(
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <Suspense fallback={null}>
              <MatchPanel matchID={match.id} />
            </Suspense>
          </ThemeProvider>
        </BrowserRouter>,
      );
    });
  }
});
