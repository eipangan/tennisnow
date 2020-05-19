import React, { Dispatch, SetStateAction } from 'react';
import { EventType } from './components/event/Event';

/**
 * AppContextType
 */
export interface AppContextType {
  events: {
    add: (event: EventType) => boolean;
    get: (eventID: string | undefined) => EventType | undefined;
    update: (event: EventType) => boolean;
    remove: (eventID: string | undefined) => boolean;
  },
  event: EventType,
  setEvent: Dispatch<SetStateAction<EventType>> | (() => {}),
  isEventSettingsVisible: boolean,
  setIsEventSettingsVisible: Dispatch<SetStateAction<boolean>> | (() => {}),
  isUserSettingsVisible: boolean,
  setIsUserSettingsVisible: Dispatch<SetStateAction<boolean>> | (() => {}),
}

export const AppContext = React.createContext({} as AppContextType);
