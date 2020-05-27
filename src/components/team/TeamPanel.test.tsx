import { render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { Player, Team } from '../../models';
import { theme } from '../utils/Theme';
import TeamPanel from './TeamPanel';

test('renders without crashing', async () => {
  const team = new Team({
    players: [
      new Player({ name: 'Player1' }),
      new Player({ name: 'Player2' }),
    ],
  });

  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <TeamPanel team={team} />
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getByRole('button')).toBeInTheDocument();
  expect(screen.getByText('Player1')).toBeInTheDocument();
  expect(screen.getByText('Player2')).toBeInTheDocument();
});
