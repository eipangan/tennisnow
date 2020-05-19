import { render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { AppContext, AppContextType } from '../../AppContext';
import { EventType, getNewEvent } from '../event/Event';
import { theme } from '../utils/Theme';
import UserSettings from './UserSettings';

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
  isUserSettingsVisible: true,
  setIsUserSettingsVisible: () => { },
};

test('renders without crashing', async () => {
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <AppContext.Provider value={app}>
            <UserSettings user={undefined} />
          </AppContext.Provider>
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>,
  );

  expect(screen.getByText('signout')).toBeInTheDocument();
});
