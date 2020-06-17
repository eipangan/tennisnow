import React from 'react';

/**
 * AppContextType
 */
export interface AppContextType {
  username: any,
}

export const AppContext = React.createContext({} as AppContextType);
