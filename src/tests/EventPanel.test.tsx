import { act, render, screen } from '@testing-library/react';
import { DataStore } from 'aws-amplify';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { EventContext } from '../EventContext';
import EventPanel from '../EventPanel';
import { useEvent } from '../EventUtils';
import { Match, MatchStatus } from '../models';
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

test('renders without with EventContext', async () => {
  expect(event).toBeDefined();

  await act(async () => {
    render(
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <EventContext.Provider value={{ event }}>
            <EventPanel />
          </EventContext.Provider>
        </Suspense>
      </ThemeProvider>,
    );
  });

  expect(screen.getByText('player')).toBeInTheDocument();
});

test('renders without without EventContext', async () => {
  await act(async () => {
    render(
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <EventPanel />
        </Suspense>
      </ThemeProvider>,
    );
  });
});
