import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { lovable } from '@/integrations/lovable';

export function GoogleSignInButton() {
  const [busy, setBusy] = useState(false);

  const signIn = async () => {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: window.location.origin,
        extraParams: { prompt: 'select_account' },
      });
      if (result.error) toast.error(result.error.message || 'Google sign-in failed. Please try again.');
    } catch {
      toast.error('Google sign-in failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button type="button" variant="outline" className="min-h-[44px] w-full gap-2" disabled={busy} onClick={() => void signIn()}>
      {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      Continue with Google
    </Button>
  );
}