import { render } from '@testing-library/react';
import { DataStore } from 'aws-amplify';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { Match, MatchStatus } from '../../models';
import { getNewEvent, getNextMatch } from '../event/EventUtils';
import { theme } from '../utils/Theme';
import MatchesList from './MatchesList';

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
    unsubscribe: () => {},
  }),
}));

test('render new without crashing', async () => {
  const { players } = event;

  const match1 = await getNextMatch(event.id, [], players);
  const match2 = await getNextMatch(event.id, [], players);
  if (players && match1 && match2) {
    const matches = [match1, match2];
    if (matches) {
      render(
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <Suspense fallback={null}>
              <MatchesList
                matches={matches}
                players={players}
              />
            </Suspense>
          </ThemeProvider>
        </BrowserRouter>,
      );
    }
  }
});
