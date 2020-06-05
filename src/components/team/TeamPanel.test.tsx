import { render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { Player, Stats, Team } from '../../models';
import { theme } from '../utils/Theme';
import TeamPanel from './TeamPanel';

test('renders without crashing', async () => {
  const team = new Team({
    players: [
      new Player({
        index: 0,
        userid: ['P1'],
        name: 'P1',
        stats: new Stats({
          numDraws: 0,
          numLost: 0,
          numMatches: 0,
          numWon: 0,
        }),
      }),
      new Player({
        index: 1,
        userid: ['P2'],
        name: 'P2',
        stats: new Stats({
          numDraws: 0,
          numLost: 0,
          numMatches: 0,
          numWon: 0,
        }),
      }),
    ],
    stats: new Stats({
      numDraws: 0,
      numLost: 0,
      numMatches: 0,
      numWon: 0,
    }),
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
  expect(screen.getByText('P1')).toBeInTheDocument();
  expect(screen.getByText('P2')).toBeInTheDocument();
});
