import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { EventContext } from '../EventContext';
import EventSettings from '../EventSettings';
import useEvent from '../hooks/useEvent';
import { theme } from '../Theme';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('EventSettings', () => {
  beforeAll(() => {
    window.matchMedia = window.matchMedia || (() => ({
      matches: false,
      addListener() { },
      removeListener() { },
    }));
  });

  it('should render without crashing when EventContext is availabe', async () => {
    const { result } = renderHook(() => useEvent());
    const { current } = result;
    const { event } = current;

    const setEventID = jest.fn((id: string) => { });

    await act(async () => {
      render(
        <ThemeProvider theme={theme}>
          <Suspense fallback={null}>
            <EventContext.Provider value={{ event, setEventID }}>
              <EventSettings onClose={() => { }} />
            </EventContext.Provider>
          </Suspense>
        </ThemeProvider>,
      );
    });

    expect(screen.getByText('eventSettings')).toBeInTheDocument();
    expect(screen.getByText('players')).toBeInTheDocument();
    expect(screen.getByText('cancel')).toBeInTheDocument();
    expect(screen.getByText('ok')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('minus'));
    fireEvent.click(screen.getByTestId('plus'));
    fireEvent.click(screen.getByText('cancel'));
    fireEvent.click(screen.getByText('ok'));
  });

  it('should render without crashing when EventContext is NOT availabe', async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={theme}>
          <Suspense fallback={null}>
            <EventSettings onClose={() => { }} />
          </Suspense>
        </ThemeProvider>,
      );
    });

    expect(screen.getByText('eventSettings')).toBeInTheDocument();
    expect(screen.getByText('players')).toBeInTheDocument();
    expect(screen.getByText('cancel')).toBeInTheDocument();
    expect(screen.getByText('ok')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('minus'));
    fireEvent.click(screen.getByTestId('plus'));
    fireEvent.click(screen.getByText('cancel'));
    fireEvent.click(screen.getByText('ok'));
  });
});
