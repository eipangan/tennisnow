import React from 'react';
import { Event } from './models';

/**
 * EventContextType
 */
export interface EventContextType {
  event: Event,
  setEventID: (id: string) => void,
}

export const EventContext = React.createContext({} as EventContextType);
