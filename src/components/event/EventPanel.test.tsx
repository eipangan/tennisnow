import { render, act } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { DataStore } from 'aws-amplify';
import { theme } from '../utils/Theme';
import EventPanel from './EventPanel';
import { getNewEvent } from './EventUtils';
import { MatchStatus, Match } from '../../models';

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
    unsubscribe: () => {},
  }),
}));

test('renders without crashing', async () => {
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <EventPanel event={event} />
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );
});
