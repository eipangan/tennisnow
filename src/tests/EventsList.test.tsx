import { act, fireEvent, render, screen } from '@testing-library/react';
import { DataStore } from 'aws-amplify';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import EventsList from '../EventsList';
import { useEvent } from '../hooks/useEvent';
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

test('renders one event without crashing', async () => {
  await act(async () => {
    render(
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <EventsList events={[event]} />
        </Suspense>
      </ThemeProvider>,
    );
  });

  expect(screen.getByTestId('delete')).toBeInTheDocument();
  expect(screen.getByTestId('settings')).toBeInTheDocument();

  fireEvent.click(screen.getByTestId('delete'));
  expect(screen.getByText('deleteEventConfirm')).toBeInTheDocument();
  expect(screen.getByText('cancel')).toBeInTheDocument();
  expect(screen.getByText('delete')).toBeInTheDocument();
  fireEvent.click(screen.getByText('cancel'));
});
