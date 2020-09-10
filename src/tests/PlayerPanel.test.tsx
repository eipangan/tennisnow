import { act, render } from '@testing-library/react';
import { fail } from 'assert';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { useEvent } from '../hooks/useEvent';
import PlayerPanel from '../PlayerPanel';
import { theme } from '../Theme';
import { getNewPlayers } from '../utils/EventUtils';

test('renders without crashing', async () => {
  const { event } = useEvent();
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
