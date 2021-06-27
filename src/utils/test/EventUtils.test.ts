import { renderHook } from '@testing-library/react-hooks';
import useEvent from '../../hooks/useEvent';
import { getNewPlayers } from '../EventUtils';

describe('EventUtils', () => {
  it('should run getPlayers() with just eventID parameter', async () => {
    const { result } = renderHook(() => useEvent());
    const { current } = result;
    const { event } = current;

    const defaultNumPlayers = 6;
    const players = getNewPlayers(event.id);

    // players
    expect(players).toBeDefined();
    expect(players).not.toBeNull();
    expect(players).toHaveLength(defaultNumPlayers);

    // eventID --- required
    expect(players?.find((player) => player.eventID === event.id)).toBeDefined();
    expect(players?.filter((player) => player.eventID === event.id)).toHaveLength(defaultNumPlayers);

    expect(players?.find((player) => player.eventID === 'ABC')).toBeUndefined();
    expect(players?.filter((player) => player.eventID === 'DEF')).toHaveLength(0);

    // index --- required
    expect(players?.find((player) => player.index === 0)).toBeDefined();
    expect(players?.find((player) => player.index === 1)).toBeDefined();
    expect(players?.find((player) => player.index === 2)).toBeDefined();
    expect(players?.find((player) => player.index === 3)).toBeDefined();
    expect(players?.find((player) => player.index === 4)).toBeDefined();
    expect(players?.find((player) => player.index === 5)).toBeDefined();
    expect(players?.find((player) => player.index === 6)).toBeUndefined();

    // name
    expect(players?.find((player) => player.name === '')).toBeDefined();
    expect(players?.filter((player) => player.name === '')).toHaveLength(defaultNumPlayers);
    expect(players?.find((player) => player.name === '1')).toBeUndefined();

    if (players) {
      players.forEach((player) => {
        expect(player).toBeDefined();
        expect(player).not.toBeNull();

        expect(player.id).toBeDefined();
        expect(player.id).not.toBeNull();
        expect(player.id.length).toBeGreaterThan(32);
      });
    }
  });

  it('should run getPlayers() with eventID, numPlayers=4 parameter', async () => {
    const { result } = renderHook(() => useEvent());
    const { current } = result;
    const { event } = current;

    const numPlayers = 4;
    const players = getNewPlayers(event.id, numPlayers);

    // players
    expect(players).toBeDefined();
    expect(players).not.toBeNull();
    expect(players).toHaveLength(numPlayers);

    // eventID --- required
    expect(players?.find((player) => player.eventID === event.id)).toBeDefined();
    expect(players?.filter((player) => player.eventID === event.id)).toHaveLength(numPlayers);

    expect(players?.find((player) => player.eventID === 'ABC')).toBeUndefined();
    expect(players?.filter((player) => player.eventID === 'DEF')).toHaveLength(0);

    // index --- required
    expect(players?.find((player) => player.index === 0)).toBeDefined();
    expect(players?.find((player) => player.index === 1)).toBeDefined();
    expect(players?.find((player) => player.index === 2)).toBeDefined();
    expect(players?.find((player) => player.index === 3)).toBeDefined();
    expect(players?.find((player) => player.index === 4)).toBeUndefined();

    // name
    expect(players?.find((player) => player.name === '')).toBeDefined();
    expect(players?.filter((player) => player.name === '')).toHaveLength(numPlayers);
    expect(players?.find((player) => player.name === '1')).toBeUndefined();
  });

  it('should run getPlayers() with eventID, numPlayers=4, playersNames parameter', async () => {
    const { result } = renderHook(() => useEvent());
    const { current } = result;
    const { event } = current;

    const numPlayers = 4;
    const playerNames = ['P1', 'P2', 'P3'];
    const players = getNewPlayers(event.id, numPlayers, playerNames);

    // players
    expect(players).toBeDefined();
    expect(players).not.toBeNull();
    expect(players).toHaveLength(numPlayers);

    // eventID --- required
    expect(players?.find((player) => player.eventID === event.id)).toBeDefined();
    expect(players?.filter((player) => player.eventID === event.id)).toHaveLength(numPlayers);

    expect(players?.find((player) => player.eventID === 'ABC')).toBeUndefined();
    expect(players?.filter((player) => player.eventID === 'DEF')).toHaveLength(0);

    // index --- required
    expect(players?.find((player) => player.index === 0)).toBeDefined();
    expect(players?.find((player) => player.index === 1)).toBeDefined();
    expect(players?.find((player) => player.index === 2)).toBeDefined();
    expect(players?.find((player) => player.index === 3)).toBeDefined();
    expect(players?.find((player) => player.index === 4)).toBeUndefined();

    // name
    expect(players?.find((player) => player.name === '')).toBeDefined();
    expect(players?.filter((player) => player.name === '')).toHaveLength(1);

    expect(players?.find((player) => player.name === 'P1')).toBeDefined();
    expect(players?.filter((player) => player.name === 'P1')).toHaveLength(1);

    expect(players?.find((player) => player.name === 'P2')).toBeDefined();
    expect(players?.filter((player) => player.name === 'P2')).toHaveLength(1);

    expect(players?.find((player) => player.name === 'P3')).toBeDefined();
    expect(players?.filter((player) => player.name === 'P3')).toHaveLength(1);

    expect(players?.find((player) => player.name === 'P4')).toBeUndefined();
  });
});
