import { act, fireEvent, render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import EventSettings from '../EventSettings';
import { Event, EventType } from '../models';
import { theme } from '../Theme';
import { getNewPlayers } from '../utils/EventUtils';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

window.matchMedia = window.matchMedia || (() => ({
  matches: false,
  addListener() { },
  removeListener() { },
}));

describe('EventSettings', () => {
  const event = new Event({
    date: dayjs().add(1, 'hour').startOf('hour').toDate()
      .toISOString(),
    type: EventType.DOUBLES_ROUND_ROBIN,
  });
  const players = getNewPlayers(event.id, 6);

  beforeAll(() => {
    expect(event).toBeDefined();
    expect(players).toBeDefined();
  });

  it('should render without crashing', async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={theme}>
          <Suspense fallback={null}>
            <EventSettings
              event={event}
              setEvent={() => { }}
              players={players}
              setPlayers={() => { }}
              onClose={() => { }}
            />
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
