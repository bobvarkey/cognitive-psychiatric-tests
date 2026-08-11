import { WifiOff, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const OfflineFallback = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground text-center">
      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
        <WifiOff className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold mb-2">You're Offline</h1>
      <p className="text-muted-foreground max-w-xs mb-8">
        It looks like your internet connection is unavailable. Please check your settings and try again.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button onClick={() => window.location.reload()} className="gap-2">
          <RefreshCcw className="h-4 w-4" /> Try Again
        </Button>
        <Button variant="outline" asChild className="gap-2">
          <a href="/">
            <Home className="h-4 w-4" /> Go to Home
          </a>
        </Button>
      </div>
    </div>
  );
};
