import { render, screen, fireEvent } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { getNewEvent, getNextMatch, getPlayers } from '../event/EventUtils';
import { theme } from '../utils/Theme';
import MatchPanel from './MatchPanel';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));


test('render new without crashing', async () => {
  const event = getNewEvent();
  const players = getPlayers(event.id, 6);
  const match = getNextMatch(event.id, players);
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

    // fireEvent.click(screen.getAllByRole('button')[0]);
  }
});
