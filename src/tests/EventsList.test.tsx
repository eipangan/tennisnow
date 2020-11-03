import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import EventsList from '../EventsList';
import useEvent from '../hooks/useEvent';
import { theme } from '../Theme';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('EventsList', () => {
  beforeAll(() => {
    window.matchMedia = window.matchMedia || (() => ({
      matches: false,
      addListener() { },
      removeListener() { },
    }));
  });

  it('renders one event without crashing', async () => {
    const { result } = renderHook(() => useEvent());
    const { current } = result;
    const { event } = current;

    await act(async () => {
      render(
        <ThemeProvider theme={theme}>
          <Suspense fallback={null}>
            <EventsList events={[event]} />
          </Suspense>
        </ThemeProvider>,
      );
    });

    expect(screen.getByTestId('delete')).toBeInTheDocument();
    expect(screen.getByTestId('settings')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('delete'));
    expect(screen.getByText('deleteEventConfirm')).toBeInTheDocument();
    expect(screen.getByText('cancel')).toBeInTheDocument();
    expect(screen.getByText('delete')).toBeInTheDocument();
    fireEvent.click(screen.getByText('cancel'));
  });
});
