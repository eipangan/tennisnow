import React from 'react';
import { Event } from './models';

/**
 * EventContextType
 */
export interface EventContextType {
  event: Event,
}

export const EventContext = React.createContext({} as EventContextType);
