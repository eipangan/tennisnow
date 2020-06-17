import { render } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { getNewEvent, getNextMatch } from '../event/EventUtils';
import { theme } from '../utils/Theme';
import MatchesList from './MatchesList';


jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

test('render new without crashing', async () => {
  const event = getNewEvent();
  const { players } = event;

  const match1 = getNextMatch(event.id, players);
  const match2 = getNextMatch(event.id, players);
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
