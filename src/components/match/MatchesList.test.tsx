import { fireEvent, render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { Match, MatchStatus, Player } from '../../models';
import { theme } from '../utils/Theme';
import MatchesList from './MatchesList';
import { getNewEvent, getNextMatch } from '../event/EventUtils';


jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

test('render new without crashing', async () => {
  const event = getNewEvent();
  const { players, matches } = event;

  const match1 = getNextMatch(event);
  const match2 = getNextMatch(event);
  if (players && matches && match1 && match2) {
    matches.push(match1);
    matches.push(match2);

    if (matches.length > 0) {
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
