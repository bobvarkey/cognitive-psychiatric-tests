import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AccountDeleted = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Account Deleted
          </h1>
          <p className="text-muted-foreground">
            Your account and all associated local data have been permanently removed from this device.
          </p>
        </div>

        <Button
          onClick={() => navigate('/', { replace: true })}
          className="w-full py-6 text-lg font-medium"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};
