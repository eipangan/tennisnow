/* eslint-disable react/jsx-no-constructed-context-values */
import { fireEvent, prettyDOM, render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { EventContext } from '../EventContext';
import MatchPanel from '../MatchPanel';
import { Event, EventType, Match, MatchStatus } from '../models';
import { theme } from '../Theme';
import { getNewPlayers } from '../utils/EventUtils';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: any) => key,
    i18n: {
      language: 'en',
      changeLanguage: (lng: string) => { },
    },
  }),
}));
jest.mock('aws-amplify');

describe('MatchPanel', () => {
  const event = new Event({
    date: dayjs().add(1, 'hour').startOf('hour').toDate()
      .toISOString(),
    type: EventType.DOUBLES_ROUND_ROBIN,
  });
  const players = getNewPlayers(event.id, 6);

  beforeAll(() => {
    expect(event).toBeDefined();
    expect(players).toBeDefined();
  });

  const fetchMatches = async (eid: string) => { };

  it('should render MatchSatus.NEW SINGLES', async () => {
    const match = new Match({
      eventID: event.id,
      orderID: 1,
      playerIndices: [0, 1],
      status: MatchStatus.NEW,
    });

    render(
      <ThemeProvider theme={theme}>
        <Suspense fallback="loading...">
          <EventContext.Provider value={{ fetchMatches }}>
            <MatchPanel
              match={match}
              players={players}
            />
          </EventContext.Provider>
        </Suspense>
      </ThemeProvider>,
    );

    // loaded
    expect(prettyDOM()).toBeDefined();
    expect(screen.getByTestId('player1')).toBeInTheDocument();
    expect(screen.getByTestId('middle')).toBeInTheDocument();
    expect(screen.getByTestId('player2')).toBeInTheDocument();
    expect(screen.getByText('vs')).toBeInTheDocument();

    // click
    fireEvent.click(screen.getByTestId('player1'));
    fireEvent.click(screen.getByTestId('middle'));
    expect(screen.getByText('vs')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('player2'));
  });

  it('should render MatchSatus.NEW DOUBLES', async () => {
    const match = new Match({
      eventID: event.id,
      orderID: 1,
      playerIndices: [0, 1, 2, 3],
      status: MatchStatus.NEW,
    });

    render(
      <ThemeProvider theme={theme}>
        <Suspense fallback="loading...">
          <EventContext.Provider value={{ fetchMatches }}>
            <MatchPanel
              match={match}
              players={players}
            />
          </EventContext.Provider>
        </Suspense>
      </ThemeProvider>,
    );

    // loaded
    expect(prettyDOM()).toBeDefined();
    expect(screen.getByTestId('player1')).toBeInTheDocument();
    expect(screen.getByTestId('middle')).toBeInTheDocument();
    expect(screen.getByTestId('player2')).toBeInTheDocument();
    expect(screen.getByText('vs')).toBeInTheDocument();

    // click
    fireEvent.click(screen.getByTestId('player1'));
    fireEvent.click(screen.getByTestId('middle'));
    expect(screen.getByText('vs')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('player2'));
  });

  it('should render MatchSatus.DRAW', async () => {
    const match = new Match({
      eventID: event.id,
      orderID: 1,
      playerIndices: [0, 1],
      status: MatchStatus.DRAW,
    });

    render(
      <ThemeProvider theme={theme}>
        <Suspense fallback="loading...">
          <EventContext.Provider value={{ fetchMatches }}>
            <MatchPanel
              match={match}
              players={players}
            />
          </EventContext.Provider>
        </Suspense>
      </ThemeProvider>,
    );

    // loaded
    expect(prettyDOM()).toBeDefined();
    expect(screen.getByTestId('player1')).toBeInTheDocument();
    expect(screen.getByTestId('middle')).toBeInTheDocument();
    expect(screen.getByTestId('player2')).toBeInTheDocument();
    expect(screen.getByText('draw')).toBeInTheDocument();

    // click
    fireEvent.click(screen.getByTestId('player1'));
    fireEvent.click(screen.getByTestId('middle'));
    expect(screen.getByText('draw')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('player2'));
  });

  it('should render MatchSatus.PLAYER1_WON', async () => {
    const match = new Match({
      eventID: event.id,
      orderID: 1,
      playerIndices: [0, 1],
      status: MatchStatus.PLAYER1_WON,
    });

    render(
      <ThemeProvider theme={theme}>
        <Suspense fallback="loading...">
          <EventContext.Provider value={{ fetchMatches }}>
            <MatchPanel
              match={match}
              players={players}
            />
          </EventContext.Provider>
        </Suspense>
      </ThemeProvider>,
    );

    // loaded
    expect(prettyDOM()).toBeDefined();
    expect(screen.getByTestId('player1')).toBeInTheDocument();
    expect(screen.getByTestId('middle')).toBeInTheDocument();
    expect(screen.getByTestId('player2')).toBeInTheDocument();
    expect(screen.getByText('draw')).toBeInTheDocument();

    // click
    fireEvent.click(screen.getByTestId('player1'));
    fireEvent.click(screen.getByTestId('middle'));
    expect(screen.getByText('draw')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('player2'));
  });

  it('should render MatchSatus.PLAYER2_WON', async () => {
    const match = new Match({
      eventID: event.id,
      orderID: 1,
      playerIndices: [0, 1],
      status: MatchStatus.PLAYER2_WON,
    });

    render(
      <ThemeProvider theme={theme}>
        <Suspense fallback="loading...">
          <EventContext.Provider value={{ fetchMatches }}>
            <MatchPanel
              match={match}
              players={players}
            />
          </EventContext.Provider>
        </Suspense>
      </ThemeProvider>,
    );

    // loaded
    expect(prettyDOM()).toBeDefined();
    expect(screen.getByTestId('player1')).toBeInTheDocument();
    expect(screen.getByTestId('middle')).toBeInTheDocument();
    expect(screen.getByTestId('player2')).toBeInTheDocument();
    expect(screen.getByText('draw')).toBeInTheDocument();

    // click
    fireEvent.click(screen.getByTestId('player1'));
    fireEvent.click(screen.getByTestId('middle'));
    expect(screen.getByText('draw')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('player2'));
  });
});
