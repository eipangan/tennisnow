import { render, screen, fireEvent } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { AppContext, AppContextType } from '../../AppContext';
import { EventType, getNewEvent } from '../event/Event';
import { theme } from '../utils/Theme';
import MatchesPanel from './MatchesPanel';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: any) => key }),
}));

const app: AppContextType = {
  events: {
    add: (event: EventType): boolean => true,
    get: (eventID: string | undefined): EventType | undefined => undefined,
    update: (event: EventType): boolean => true,
    remove: (eventID: string | undefined): boolean => true,
  },
  event: getNewEvent(),
  setEvent: () => { },
  isEventSettingsVisible: false,
  setIsEventSettingsVisible: () => { },
  isUserSettingsVisible: false,
  setIsUserSettingsVisible: () => { },
};

test('render new without crashing', async () => {
  const event = getNewEvent();
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <AppContext.Provider value={app}>
            <MatchesPanel
              data={event.orderedMatches}
              onUpdate={() => {}}
            />
          </AppContext.Provider>
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getAllByText('1')).toHaveLength(8);
  expect(screen.getAllByText('2')).toHaveLength(8);
  expect(screen.getAllByText('vs')).toHaveLength(12);
  expect(screen.getAllByText('3')).toHaveLength(8);
  expect(screen.getAllByText('4')).toHaveLength(8);

  fireEvent.click(screen.getAllByText('vs')[0]);
});
