import { render } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { getNewEvent, getNextMatch } from '../event/EventUtils';
import { theme } from '../utils/Theme';
import MatchPanel from './MatchPanel';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));


test('render new without crashing', async () => {
  const event = getNewEvent();
  const { players, matches } = event;

  const match = getNextMatch(event);
  if (players && matches && match) {
    matches.push(match);

    if (matches.length > 0) {
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
    }
  }
});
