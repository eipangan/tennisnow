import { render } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { getNewEvent, getNewPlayers } from '../EventUtils';
import { theme } from '../Theme';
import PlayersSummary from '../PlayersSummary';

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

test('renders without crashing', () => {
  const event = getNewEvent();
  const players = getNewPlayers(event.id, 6);
  render(
    <ThemeProvider theme={theme}>
      <Suspense fallback={null}>
        <PlayersSummary
          players={players || []}
          matches={[]}
        />
      </Suspense>
    </ThemeProvider>,
  );
});
