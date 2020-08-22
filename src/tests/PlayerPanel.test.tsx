import { act, render } from '@testing-library/react';
import { fail } from 'assert';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { getNewEvent, getNewPlayers } from '../EventUtils';
import PlayerPanel from '../PlayerPanel';
import { theme } from '../Theme';

test('renders without crashing', async () => {
  const event = getNewEvent();
  const players = getNewPlayers(event.id, 6);

  expect(event).toBeDefined();
  expect(players).toBeDefined();

  if (!players) fail('players undefined');
  const player = players[0];

  expect(player).toBeDefined();

  await act(async () => {
    render(
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <PlayerPanel
            player={player}
          />
        </Suspense>
      </ThemeProvider>,
    );
  });
});
