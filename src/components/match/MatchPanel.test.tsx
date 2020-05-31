import { render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { Match, MatchStatus, Player, Team } from '../../models';
import { theme } from '../utils/Theme';
import MatchPanel from './MatchPanel';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));


test('render new without crashing', async () => {
  const match = new Match({
    teams: [
      new Team({
        players: [
          new Player({ name: 'Player1' }),
          new Player({ name: 'Player2' }),
        ],
      }),
      new Team({
        players: [
          new Player({ name: 'Player3' }),
          new Player({ name: 'Player4' }),
        ],
      }),
    ],
    status: MatchStatus.NEW,
  });

  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <MatchPanel
            match={match}
          />
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getByText('Player1')).toBeInTheDocument();
  expect(screen.getByText('Player2')).toBeInTheDocument();
  expect(screen.getByText('vs')).toBeInTheDocument();
  expect(screen.getByText('Player3')).toBeInTheDocument();
  expect(screen.getByText('Player4')).toBeInTheDocument();
});
