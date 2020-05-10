import { render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { theme } from '../utils/Theme';
import Player, { CompetitorStats, PlayerType } from './Player';

test('renders without crashing', async () => {
  const player: PlayerType = {
    playerID: String(1),
    playerName: '',
    stats: new CompetitorStats(),
  };

  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <Player playerID={player.playerID} />
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getByText('1')).toBeInTheDocument();
});
