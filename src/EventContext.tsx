import React from 'react';
import { Event, Match } from './models';

/**
 * EventContextType
 */
export interface EventContextType {
  event: Event,
  getNextMatch?: () => Promise<Match | undefined>,
}

export const EventContext = React.createContext({} as EventContextType);
