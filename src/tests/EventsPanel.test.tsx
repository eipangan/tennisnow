import { render, screen } from '@testing-library/react';
import { DataStore } from 'aws-amplify';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { Match, MatchStatus } from '../models';
import { theme } from '../Theme';
import EventsPanel from '../EventsPanel';
import { getNewEvent } from '../EventUtils';

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

const event = getNewEvent();

DataStore.query = jest.fn().mockImplementation(() => [new Match({
  eventID: event.id,
  status: MatchStatus.NEW,
})]);

DataStore.observe = jest.fn().mockImplementation(() => ({
  subscribe: () => ({
    unsubscribe: () => { },
  }),
}));

test('renders one event without crashing', () => {
  render(
    <ThemeProvider theme={theme}>
      <Suspense fallback={null}>
        <EventsPanel events={[]} />
      </Suspense>
    </ThemeProvider>,
  );

  expect(screen.getByText('events')).toBeInTheDocument();
  expect(screen.getByText('finished')).toBeInTheDocument();
  expect(screen.getByText('newEvent')).toBeInTheDocument();
});
