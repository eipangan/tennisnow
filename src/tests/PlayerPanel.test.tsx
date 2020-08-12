import { render } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { getNewEvent, getNewPlayers } from '../EventUtils';
import { theme } from '../Theme';
import PlayerPanel from '../PlayerPanel';

test('renders without crashing', async () => {
  const event = getNewEvent();
  const players = getNewPlayers(event.id, 6);
  if (players) {
    const player = players[0];

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
  }
});
