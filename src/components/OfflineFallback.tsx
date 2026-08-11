import { WifiOff, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const OfflineFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-in fade-in duration-500">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <WifiOff className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">You're Offline</h2>
      <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
        This clinical tool requires an internet connection for some features. Please check your network and try again.
      </p>
      <Button 
        onClick={() => window.location.reload()}
        className="gap-2 rounded-xl h-11 px-6 shadow-lg hover:scale-105 transition-transform"
      >
        <RefreshCcw className="h-4 w-4" />
        Retry Connection
      </Button>
    </div>
  );
};
