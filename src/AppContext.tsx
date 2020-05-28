import React, { Dispatch, SetStateAction } from 'react';
import { Event } from './models';


/**
 * AppContextType
 */
export interface AppContextType {
  events: {
    add: (event: Event) => boolean;
    get: (eventID: string | undefined) => Event | undefined;
    update: (event: Event) => boolean;
    remove: (eventID: string | undefined) => boolean;
  },
  event: Event,
  setEvent: Dispatch<SetStateAction<Event>> | (() => {}),
  isEventSettingsVisible: boolean,
  setIsEventSettingsVisible: Dispatch<SetStateAction<boolean>> | (() => {}),
  isUserSettingsVisible: boolean,
  setIsUserSettingsVisible: Dispatch<SetStateAction<boolean>> | (() => {}),
}

export const AppContext = React.createContext({} as AppContextType);
