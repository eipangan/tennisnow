import { act, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { EventContext } from '../EventContext';
import EventPanel from '../EventPanel';
import useEvent from '../hooks/useEvent';
import { theme } from '../Theme';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('EventPanel', () => {
  beforeAll(() => {
    window.matchMedia = window.matchMedia || (() => ({
      matches: false,
      addListener() { },
      removeListener() { },
    }));
  });

  it('should render without with EventContext', async () => {
    const { result } = renderHook(() => useEvent());
    const { current } = result;
    const { event } = current;

    const setEventID = jest.fn((id: string) => { });

    expect(event).toBeDefined();

    await act(async () => {
      render(
        <ThemeProvider theme={theme}>
          <Suspense fallback={null}>
            <EventContext.Provider value={{ event, setEventID }}>
              <EventPanel />
            </EventContext.Provider>
          </Suspense>
        </ThemeProvider>,
      );
    });

    expect(screen.getByText('player')).toBeInTheDocument();
  });

  it('should render without without EventContext', async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={theme}>
          <Suspense fallback={null}>
            <EventPanel />
          </Suspense>
        </ThemeProvider>,
      );
    });
  });
});