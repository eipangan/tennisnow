import React from 'react';
import { Event, Match } from './models';

/**
 * EventContextType
 */
export interface EventContextType {
  event: Event,
  setEventID: (id: string) => void,
  getNextMatch?: () => Promise<Match | undefined>,
}

export const EventContext = React.createContext({} as EventContextType);
