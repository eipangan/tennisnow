import { render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { AppContext, AppContextType } from '../../AppContext';
import { theme } from '../utils/Theme';
import { EventType, getNewEvent } from './Event';
import EventsList from './EventsList';

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

  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <AppContext.Provider value={app}>
            <EventsList data={[]} />
          </AppContext.Provider>
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getByText('noEvents')).toBeInTheDocument();
});
