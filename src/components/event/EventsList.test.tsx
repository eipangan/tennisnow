import { fireEvent, render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { theme } from '../utils/Theme';
import EventsList from './EventsList';
import getNewEvent from './EventUtils';

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

test('renders empty event without crashing', async () => {
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <EventsList events={[]} />
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getByText('noEvents')).toBeInTheDocument();
});

test('renders one event without crashing', async () => {
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <EventsList events={[getNewEvent()]} />
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getByText('eventSummary')).toBeInTheDocument();
  expect(screen.getByTestId('delete')).toBeInTheDocument();
  expect(screen.getByTestId('settings')).toBeInTheDocument();

  fireEvent.click(screen.getByTestId('delete'));
  expect(screen.getByText('deleteEventConfirm')).toBeInTheDocument();
  expect(screen.getByText('cancel')).toBeInTheDocument();
  expect(screen.getByText('delete')).toBeInTheDocument();
  fireEvent.click(screen.getByText('cancel'));

  fireEvent.click(screen.getByTestId('settings'));
});

test('renders two events without crashing', async () => {
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <EventsList events={[getNewEvent(), getNewEvent()]} />
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getAllByText('eventSummary')).toHaveLength(2);
  expect(screen.getAllByTestId('delete')).toHaveLength(2);
  expect(screen.getAllByTestId('settings')).toHaveLength(2);

  fireEvent.click(screen.getAllByTestId('delete')[0]);
  expect(screen.getByText('deleteEventConfirm')).toBeInTheDocument();
  expect(screen.getByText('cancel')).toBeInTheDocument();
  expect(screen.getByText('delete')).toBeInTheDocument();
  fireEvent.click(screen.getByText('cancel'));

  fireEvent.click(screen.getAllByTestId('settings')[0]);
});
