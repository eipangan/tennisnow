import { prettyDOM, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { fail } from 'assert';
import React from 'react';
import { ThemeProvider } from 'react-jss';
import useEvent from '../hooks/useEvent';
import { Player } from '../models';
import PlayerPanel from '../PlayerPanel';
import { theme } from '../Theme';
import { getNewPlayers } from '../utils/EventUtils';

let player: Player;

beforeAll(() => {
  const { result } = renderHook(() => useEvent());
  const { current } = result;
  const { event } = current;

  const players = getNewPlayers(event.id, 6);

  expect(event).toBeDefined();
  expect(players).toBeDefined();

  if (!players) fail('players undefined');
  [player] = players;

  expect(player).toBeDefined();
});

test('renders without crashing', async () => {
  render(
    <ThemeProvider theme={theme}>
      <PlayerPanel
        player={player}
      />
    </ThemeProvider>,
  );

  expect(prettyDOM()).toBeDefined();
});
