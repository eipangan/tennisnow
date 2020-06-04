import { fireEvent, render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { AppContext, AppContextType } from '../../AppContext';
import { theme } from '../utils/Theme';
import EventsPanel from './EventsPanel';
import { getNewEvent } from './EventUtils';

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

// initialize app AppContext
const app: AppContextType = {
  event: getNewEvent(),
  setEvent: () => {},
  isEventSettingsVisible: true,
  setIsEventSettingsVisible: () => {},
};

test('renders one event without crashing', async () => {
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <AppContext.Provider value={app}>
            <EventsPanel events={[getNewEvent()]} />
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
