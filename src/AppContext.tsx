import React, { Dispatch, SetStateAction } from 'react';
import { Event } from './models';

/**
 * AppContextType
 */
export interface AppContextType {
  event: Event,
  setEvent: Dispatch<SetStateAction<Event>> | (() => {}),
  isEventSettingsVisible: boolean,
  setIsEventSettingsVisible: Dispatch<SetStateAction<boolean>> | (() => {}),
}

export const AppContext = React.createContext({} as AppContextType);
