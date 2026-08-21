import { Wifi, WifiOff } from 'lucide-react';
import { useOffline } from '../contexts/OfflineContext';

export const OfflineIndicator = () => {
  const { isOnline } = useOffline();

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg transition-all ${
      isOnline ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
    }`}>
      {isOnline ? (
        <><Wifi className="h-3 w-3" /> Online</>
      ) : (
        <><WifiOff className="h-3 w-3" /> Offline</>
      )}
    </div>
  );
};
