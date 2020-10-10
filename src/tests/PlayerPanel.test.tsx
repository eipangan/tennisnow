import { prettyDOM, render, screen } from '@testing-library/react';
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
const playerName = 'MyPlayer';

beforeAll(() => {
  const { result } = renderHook(() => useEvent());
  const { current } = result;
  const { event } = current;

  const players = getNewPlayers(event.id, 6);

  expect(event).toBeDefined();
  expect(players).toBeDefined();

  if (!players) fail('players undefined');
  const [myPlayer] = players;
  player = Player.copyOf(myPlayer, (updated) => {
    updated.name = playerName;
  });

  expect(player).toBeDefined();
});

describe('renders a PlayerPanel', () => {
  it('should return a valid DOM', async () => {
    render(
      <ThemeProvider theme={theme}>
        <PlayerPanel
          player={player}
        />
      </ThemeProvider>,
    );

    expect(prettyDOM()).toBeDefined();
  });

  it('should show player name properly', async () => {
    render(
      <ThemeProvider theme={theme}>
        <PlayerPanel
          player={player}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText(playerName)).toBeInTheDocument();
  });
});
