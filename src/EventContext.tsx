import React from 'react';

export interface EventContextType {
  fetchMatches: (eventID: string) => void;
}

export const EventContext = React.createContext({} as EventContextType);
