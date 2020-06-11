import { render } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { theme } from '../utils/Theme';
import EventPanel from './EventPanel';
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

test('renders without crashing', async () => {
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <EventPanel event={getNewEvent()} />
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );
});
