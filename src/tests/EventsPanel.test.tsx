import { render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import EventsPanel from '../EventsPanel';
import { theme } from '../Theme';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe('EventsPanel', () => {
  beforeAll(() => {
    window.matchMedia = window.matchMedia || (() => ({
      matches: false,
      addListener() { },
      removeListener() { },
    }));
  });

  it('renders one event without crashing', async () => {
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
});
