import React, { Dispatch, SetStateAction } from 'react';
import { Event } from './models';

/**
 * AppContextType
 */
export interface AppContextType {
  event: Event,
  setEvent: Dispatch<SetStateAction<Event>> | (() => {}),
}

export const AppContext = React.createContext({} as AppContextType);
