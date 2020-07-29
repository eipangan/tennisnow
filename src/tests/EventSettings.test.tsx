import { act, fireEvent, render, screen } from '@testing-library/react';
import { DataStore } from 'aws-amplify';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import EventSettings from '../EventSettings';
import { getNewEvent } from '../EventUtils';
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

test('renders without crashing', async () => {
  await act(async () => {
    render(
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <EventSettings eventID={event.id} onClose={() => { }} />
        </Suspense>
      </ThemeProvider>,
    );
  });

  expect(screen.getByText('eventSettings')).toBeInTheDocument();
  expect(screen.getByText('players')).toBeInTheDocument();
  expect(screen.getByText('clearNames')).toBeInTheDocument();
  expect(screen.getByText('randomizeOrder')).toBeInTheDocument();
  expect(screen.getByText('cancel')).toBeInTheDocument();
  expect(screen.getByText('ok')).toBeInTheDocument();

  fireEvent.click(screen.getByTestId('minus'));

  fireEvent.click(screen.getByText('clearNames'));
  fireEvent.click(screen.getByText('randomizeOrder'));
  fireEvent.click(screen.getByText('cancel'));
  fireEvent.click(screen.getByText('ok'));
});
