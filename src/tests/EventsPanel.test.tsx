import { render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import EventsPanel from '../EventsPanel';
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

test('renders one event without crashing', async () => {
  render(
    <ThemeProvider theme={theme}>
      <Suspense fallback={null}>
        <EventsPanel events={[]} />
      </Suspense>
    </ThemeProvider>,
  );

  expect(screen.getByText('events')).toBeInTheDocument();
  expect(screen.getByText('finished')).toBeInTheDocument();
  expect(screen.getByText('newEvent')).toBeInTheDocument();
});
