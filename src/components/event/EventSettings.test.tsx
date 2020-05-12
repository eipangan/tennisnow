import { render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { AppContext } from '../../App';
import { theme } from '../utils/Theme';
import { EventType, getNewEvent } from './Event';
import EventSettings from './EventSettings';

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

test('renders without crashing', async () => {
  const app = {
    events: {
      add: (event: EventType): boolean => true,
      get: (eventID: string | undefined): EventType | undefined => undefined,
      update: (event: EventType): boolean => true,
      remove: (eventID: string | undefined): boolean => true,
    },
    event: getNewEvent(),
    setEvent: () => { },
    isSettingsVisible: true,
    setIsSettingsVisible: () => { },
    isAuthVisible: false,
    setIsAuthVisible: () => { },
  };

  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <AppContext.Provider value={app}>
            <EventSettings />
          </AppContext.Provider>
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getByText('eventSettings')).toBeInTheDocument();

  expect(screen.getByText('players')).toBeInTheDocument();

  expect(screen.getByText('clearNames')).toBeInTheDocument();
  expect(screen.getByText('randomizeOrder')).toBeInTheDocument();

  expect(screen.getByText('cancel')).toBeInTheDocument();
  expect(screen.getByText('ok')).toBeInTheDocument();
});
