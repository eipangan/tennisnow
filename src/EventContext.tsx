import React from 'react';
import { Event } from './models';

/**
 * EventContextType
 */
export interface EventContextType {
    eventID: string,
    event: Event,
}

export const EventContext = React.createContext({} as EventContextType);
