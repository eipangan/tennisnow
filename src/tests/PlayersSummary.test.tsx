import { act, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { EventContext } from '../EventContext';
import useEvent from '../hooks/useEvent';
import PlayersSummary from '../PlayersSummary';
import { theme } from '../Theme';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('PlayersSummary', () => {
  beforeAll(() => {
    window.matchMedia = window.matchMedia || (() => ({
      matches: false,
      addListener() { },
      removeListener() { },
    }));
  });

  it('renders without crashing with EventContext', async () => {
    const { result } = renderHook(() => useEvent());
    const { current } = result;
    const { event } = current;

    expect(event).toBeDefined();

    await act(async () => {
      render(
        <ThemeProvider theme={theme}>
          <Suspense fallback={null}>
            <EventContext.Provider value={{ event }}>
              <PlayersSummary />
            </EventContext.Provider>
          </Suspense>
        </ThemeProvider>,
      );
    });

    expect(screen.getByText('player')).toBeInTheDocument();
  });

  it('renders without crashing without EventContext', async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={theme}>
          <Suspense fallback={null}>
            <PlayersSummary />
          </Suspense>
        </ThemeProvider>,
      );
    });

    expect(screen.getByText('player')).toBeInTheDocument();
    expect(screen.getByText('won')).toBeInTheDocument();
    expect(screen.getByText('lost')).toBeInTheDocument();
    expect(screen.getByText('draw')).toBeInTheDocument();
  });
});
