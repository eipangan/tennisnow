import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { EventContext } from '../EventContext';
import useEvent from '../hooks/useEvent';
import MatchesList from '../MatchesList';
import { theme } from '../Theme';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('MatchesList', () => {
  it('should render MatchesList with EventContext', async () => {
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
              <MatchesList />
            </EventContext.Provider>
          </Suspense>
        </ThemeProvider>,
      );
    });

    expect(screen.getByTestId('more')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('more'));
  });

  it('should render MatchesList without EventContext', async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={theme}>
          <Suspense fallback={null}>
            <MatchesList />
          </Suspense>
        </ThemeProvider>,
      );
    });

    expect(screen.getByTestId('more')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('more'));
  });
});
