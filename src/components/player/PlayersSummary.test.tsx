import { render } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { Event } from '../../models';
import { getNewEvent } from '../event/EventUtils';
import { theme } from '../utils/Theme';
import PlayersSummary from './PlayersSummary';

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
  const event: Event = getNewEvent();
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <PlayersSummary event={event} />
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );
});
