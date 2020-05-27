import { fireEvent, render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { Match, Player, Team, MatchStatus } from '../../models';
import { theme } from '../utils/Theme';
import MatchesPanel from './MatchesPanel';


jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

test('render new without crashing', async () => {
  const matches = [
    new Match({
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
    }),
    new Match({
      teams: [
        new Team({
          players: [
            new Player({ name: 'Player5' }),
            new Player({ name: 'Player6' }),
          ],
        }),
        new Team({
          players: [
            new Player({ name: 'Player7' }),
            new Player({ name: 'Player8' }),
          ],
        }),
      ],
      status: MatchStatus.NEW,
    }),
  ];

  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <MatchesPanel
            matches={matches}
            onUpdate={() => { }}
          />
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getAllByText('vs')).toHaveLength(2);

  expect(screen.getByText('Player1')).toBeInTheDocument();
  expect(screen.getByText('Player2')).toBeInTheDocument();
  expect(screen.getByText('Player3')).toBeInTheDocument();
  expect(screen.getByText('Player4')).toBeInTheDocument();

  expect(screen.getByText('Player5')).toBeInTheDocument();
  expect(screen.getByText('Player6')).toBeInTheDocument();
  expect(screen.getByText('Player7')).toBeInTheDocument();
  expect(screen.getByText('Player8')).toBeInTheDocument();

  fireEvent.click(screen.getAllByText('vs')[0]);
});
