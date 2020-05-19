import { fireEvent, render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { AppContext, AppContextType } from '../../AppContext';
import { theme } from '../utils/Theme';
import Event, { EventType, getNewEvent } from './Event';

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
  isEventSettingsVisible: false,
  setIsEventSettingsVisible: () => { },
  isUserSettingsVisible: false,
  setIsUserSettingsVisible: () => { },
};

test('renders without crashing', async () => {
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <AppContext.Provider value={app}>
            <Event />
          </AppContext.Provider>
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  // matches
  expect(screen.getAllByText('vs')).toHaveLength(12);

  // player summary
  expect(screen.getByText('player')).toBeInTheDocument();
  expect(screen.getByText('won')).toBeInTheDocument();
  expect(screen.getByText('lost')).toBeInTheDocument();
  expect(screen.getByText('draw')).toBeInTheDocument();
});

test('clicking matches works', async () => {
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <AppContext.Provider value={app}>
            <Event />
          </AppContext.Provider>
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  // click on first "vs"
  fireEvent.click(screen.getAllByText('vs')[0]);
  expect(screen.getAllByText('vs')).toHaveLength(12);
  expect(screen.getAllByText('draw')).toHaveLength(1);

  // click on first "1"
  fireEvent.click(screen.getAllByText('1')[0]);
  expect(screen.getAllByText('vs')).toHaveLength(12);
  expect(screen.getAllByText('draw')).toHaveLength(1);

  // click on first "6"
  fireEvent.click(screen.getAllByText('6')[0]);
  expect(screen.getAllByText('vs')).toHaveLength(12);
  expect(screen.getAllByText('draw')).toHaveLength(1);
});
