import { fireEvent, render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { AppContext, AppContextType } from '../../AppContext';
import { theme } from '../utils/Theme';
import { EventType, getNewEvent } from './Event';
import EventsPanel from './EventsPanel';

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

const app: AppContextType = {
  events: {
    add: (event: EventType): boolean => true,
    get: (eventID: string | undefined): EventType | undefined => undefined,
    update: (event: EventType): boolean => true,
    remove: (eventID: string | undefined): boolean => true,
  },
  event: getNewEvent(),
  setEvent: () => { },
  isEventSettingsVisible: true,
  setIsEventSettingsVisible: () => { },
  isUserSettingsVisible: false,
  setIsUserSettingsVisible: () => { },
};

test('renders empty event without crashing', async () => {
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <AppContext.Provider value={app}>
            <EventsPanel data={[]} />
          </AppContext.Provider>
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getByText('events')).toBeInTheDocument();
  expect(screen.getByText('finished')).toBeInTheDocument();
  expect(screen.getByText('newEvent')).toBeInTheDocument();
  expect(screen.getByText('noEvents')).toBeInTheDocument();

  fireEvent.click(screen.getByText('events'));
  fireEvent.click(screen.getByText('finished'));
  fireEvent.click(screen.getByText('newEvent'));
});

test('renders one event without crashing', async () => {
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <AppContext.Provider value={app}>
            <EventsPanel data={[getNewEvent()]} />
          </AppContext.Provider>
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getByText('events')).toBeInTheDocument();
  expect(screen.getByText('finished')).toBeInTheDocument();
  expect(screen.getByText('newEvent')).toBeInTheDocument();
  expect(screen.getByText('eventSummary')).toBeInTheDocument();

  fireEvent.click(screen.getByText('events'));
  fireEvent.click(screen.getByText('finished'));
  fireEvent.click(screen.getByText('newEvent'));
});
