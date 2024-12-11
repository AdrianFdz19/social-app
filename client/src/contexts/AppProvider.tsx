// AppProvider.tsx

import React, { createContext, useContext } from 'react'

const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
};

export default function AppProvider({children}) {

    const apiUrl = import.meta.env.VITE_API_URL;
    const appEnv = import.meta.env.VITE_APP_ENV;

    let value = {
        apiUrl,
        appEnv
    }

  return (
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
  )
}
