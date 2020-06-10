import { render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { Player } from '../../models';
import { theme } from '../utils/Theme';
import PlayerPanel from './PlayerPanel';

test('renders without crashing', async () => {
  const player = new Player({
    index: 0,
    userIDs: ['P1'],
    name: 'P1',
  });

  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <PlayerPanel
            player={player}
          />
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getByText('P1')).toBeInTheDocument();
});
