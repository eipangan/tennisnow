import { act, render, screen } from '@testing-library/react';
import { DataStore } from 'aws-amplify';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { EventContext } from '../EventContext';
import { useEvent } from '../hooks/useEvent';
import { Match, MatchStatus } from '../models';
import PlayersSummary from '../PlayersSummary';
import { theme } from '../Theme';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const { event } = useEvent();

DataStore.query = jest.fn().mockImplementation(() => [new Match({
  eventID: event.id,
  status: MatchStatus.NEW,
})]);

DataStore.observe = jest.fn().mockImplementation(() => ({
  subscribe: () => ({
    unsubscribe: () => { },
  }),
}));

test('renders without crashing with EventContext', async () => {
  expect(event).toBeDefined();

  await act(async () => {
    render(
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <EventContext.Provider value={{ event }}>
            <PlayersSummary />
          </EventContext.Provider>
        </Suspense>
      </ThemeProvider>,
    );
  });

  expect(screen.getByText('player')).toBeInTheDocument();
});

test('renders without crashing without EventContext', async () => {
  await act(async () => {
    render(
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <PlayersSummary />
        </Suspense>
      </ThemeProvider>,
    );
  });

  expect(screen.getByText('player')).toBeInTheDocument();
  expect(screen.getByText('won')).toBeInTheDocument();
  expect(screen.getByText('lost')).toBeInTheDocument();
  expect(screen.getByText('draw')).toBeInTheDocument();
});
