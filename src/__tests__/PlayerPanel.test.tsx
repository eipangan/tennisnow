import { prettyDOM, render, screen } from '@testing-library/react';
import { fail } from 'assert';
import dayjs from 'dayjs';
import React from 'react';
import { ThemeProvider } from 'react-jss';
import { Event, EventType, Player } from '../models';
import PlayerPanel from '../PlayerPanel';
import { theme } from '../Theme';
import { getNewPlayers } from '../utils/EventUtils';

let player: Player;

describe('PlayerPanel', () => {
  beforeAll(() => {
    const event = new Event({
      date: dayjs().add(1, 'hour').startOf('hour').toDate()
        .toISOString(),
      type: EventType.DOUBLES_ROUND_ROBIN,
    });
    const players = getNewPlayers(event.id, 6);

    expect(event).toBeDefined();
    expect(players).toBeDefined();

    if (!players) fail('players undefined');
    [player] = players;
    expect(player).toBeDefined();
  });

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

  it('should handle empty player name', async () => {
    const myPlayer = Player.copyOf(player, (updated) => {
    });

    render(
      <ThemeProvider theme={theme}>
        <PlayerPanel
          player={myPlayer}
        />
      </ThemeProvider>,
    );

    expect(prettyDOM()).toBeDefined();
  });

  it('should show player name if defined in player object', async () => {
    const playerName = 'MyPlayer';
    const myPlayer = Player.copyOf(player, (updated) => {
      updated.name = playerName;
    });

    render(
      <ThemeProvider theme={theme}>
        <PlayerPanel
          player={myPlayer}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText(playerName)).toBeInTheDocument();
  });
});
