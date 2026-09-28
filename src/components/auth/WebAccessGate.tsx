import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Paywall } from '@/components/Paywall';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, LogOut } from 'lucide-react';

type Trial = { started_at: string; ends_at: string } | null;

import { waitForWrapper } from '@/lib/appbuild/wrapper';

/** Native app (AppBuild wrapper ready) keeps its own store paywall; gate applies to the website only.
 *  The AppBuild SDK script defines window.AppbuildWrapper in browsers too, so only a resolved ready counts. */
const useIsNativeApp = () => {
  const [native, setNative] = useState<boolean | null>(null);
  useEffect(() => { waitForWrapper().then((r) => setNative(!!r)); }, []);
  return native;
};

const Shell = ({ children }: { children: ReactNode }) => (
  <main className="min-h-screen bg-background flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))]">
    <Card className="w-full max-w-md p-6 space-y-4">{children}</Card>
  </main>
);

const AuthScreen = () => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email, password, options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success('Check your email to confirm your account.');
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success('Password reset link sent.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const oauth = async (provider: 'google' | 'apple') => {
    const r = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
    if (r.error) toast.error(r.error.message ?? 'Sign-in failed');
  };

  return (
    <Shell>
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">PsyCog Metric</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to start your free 3-day trial or unlock Premium.
        </p>
      </div>
      {mode !== 'forgot' && (
        <div className="grid gap-2">
          <Button variant="outline" className="h-11" onClick={() => oauth('google')}>Continue with Google</Button>
          <Button variant="outline" className="h-11" onClick={() => oauth('apple')}>Continue with Apple</Button>
          <p className="text-center text-xs text-muted-foreground">or</p>
        </div>
      )}
      <form onSubmit={submit} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {mode !== 'forgot' && (
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={6}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        )}
        <Button type="submit" className="w-full h-11" disabled={busy}>
          {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'signup' ? 'Create account' : mode === 'forgot' ? 'Send reset link' : 'Sign in'}
        </Button>
      </form>
      <div className="flex justify-between text-sm">
        <button className="min-h-11 text-primary hover:underline" onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}>
          {mode === 'signup' ? 'Have an account? Sign in' : 'Create an account'}
        </button>
        {mode !== 'forgot' ? (
          <button className="min-h-11 text-muted-foreground hover:underline" onClick={() => setMode('forgot')}>Forgot password?</button>
        ) : (
          <button className="min-h-11 text-muted-foreground hover:underline" onClick={() => setMode('signin')}>Back</button>
        )}
      </div>
    </Shell>
  );
};

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success('Password updated.');
    window.location.replace('/');
  };
  return (
    <Shell>
      <h1 className="text-xl font-semibold">Set a new password</h1>
      <form onSubmit={submit} className="space-y-3">
        <Input type="password" required minLength={6} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" className="w-full h-11" disabled={busy}>Update password</Button>
      </form>
    </Shell>
  );
};

export const WebAccessGate = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const native = useIsNativeApp();
  const { webPremium, restoreWebAccess } = useSubscription();
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [trial, setTrial] = useState<Trial>(null);
  const [trialLoaded, setTrialLoaded] = useState(false);
  const [starting, setStarting] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (native !== false) return;
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setAuthReady(true); });
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => { sub.subscription.unsubscribe(); clearInterval(id); };
  }, [native]);

  const userId = session?.user.id;
  const userEmail = session?.user.email;
  useEffect(() => {
    if (native !== false || !userId) { setTrial(null); setTrialLoaded(false); return; }
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from('user_trials').select('started_at, ends_at').eq('user_id', userId).maybeSingle();
      if (!cancelled) { setTrial(data ?? null); setTrialLoaded(true); }
      if (userEmail && !webPremium) restoreWebAccess(userEmail).catch(() => undefined);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [native, userId]);

  if (native === null) return <Shell><Loader2 className="mx-auto h-6 w-6 animate-spin" /></Shell>;
  if (native) return <>{children}</>;
  if (location.pathname === '/reset-password') return <ResetPassword />;
  if (!authReady) return <Shell><Loader2 className="mx-auto h-6 w-6 animate-spin" /></Shell>;
  if (!session) return <AuthScreen />;

  const trialActive = !!trial && new Date(trial.ends_at).getTime() > now;
  if (webPremium || trialActive) return <>{children}</>;
  if (!trialLoaded) return <Shell><Loader2 className="mx-auto h-6 w-6 animate-spin" /></Shell>;

  const startTrial = async () => {
    setStarting(true);
    const { data, error } = await supabase.rpc('start_trial');
    setStarting(false);
    if (error) return toast.error(error.message);
    setTrial(data as Trial);
  };

  return (
    <main className="min-h-screen bg-background p-4 pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground truncate">Signed in as {session.user.email}</p>
          <Button variant="ghost" size="sm" className="min-h-11" onClick={() => supabase.auth.signOut()}>
            <LogOut className="mr-1 h-4 w-4" /> Sign out
          </Button>
        </div>
        <Card className="p-4 space-y-2">
          <h2 className="font-semibold">Free 3-day trial</h2>
          {trial ? (
            <p className="text-sm text-muted-foreground">
              Your free trial ended on {new Date(trial.ends_at).toLocaleDateString()}. Choose a plan below to continue.
            </p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">Full access for 3 days. Available once per account.</p>
              <Button className="w-full h-11" onClick={startTrial} disabled={starting}>
                {starting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Start free trial
              </Button>
            </>
          )}
        </Card>
        <Paywall />
      </div>
    </main>
  );
};

export default WebAccessGate;
