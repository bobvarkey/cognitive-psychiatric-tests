import { createContext, useContext, ReactNode } from 'react';
import { useOfflineStatus } from '../hooks/useOfflineStatus';

const OfflineContext = createContext<{ isOnline: boolean }>({ isOnline: true });

export const OfflineProvider = ({ children }: { children: ReactNode }) => {
  const { isOnline } = useOfflineStatus();
  return (
    <OfflineContext.Provider value={{ isOnline }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => useContext(OfflineContext);
