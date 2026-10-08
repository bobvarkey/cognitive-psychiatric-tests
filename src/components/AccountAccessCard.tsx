import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Check, Copy, KeyRound, Loader2, LogOut, ShieldQuestion } from 'lucide-react';
import {
  type AuthUser,
  currentAuthUser,
  hasPremium,
  onAuthChange,
  requestEmailCode,
  signOut,
  verifyEmailCode,
} from '@/lib/entitlement';

/**
 * Sign-in and access status for the account screen.
 *
 * Two jobs:
 *  - prove you own the address with an emailed one-time code, which is what
 *    mints a real session. An email string on its own is never treated as proof.
 *  - report what the *server* says about access, and when it says no, show the
 *    auth user id an administrator has to grant. That id is read from the live
 *    session, never typed in or guessed.
 */
export const AccountAccessCard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [premium, setPremium] = useState<boolean | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const who = await currentAuthUser();
    setUser(who);
    setPremium(who ? await hasPremium() : false);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    return onAuthChange(() => {
      void refresh();
    });
  }, [refresh]);

  const handleSendCode = async () => {
    setBusy(true);
    const result = await requestEmailCode(email);
    setBusy(false);
    if (!result.ok) {
      toast.error(result.message ?? 'Could not send a code.');
      return;
    }
    setCodeSent(true);
    toast.success('Code sent. Check your email.');
  };

  const handleVerify = async () => {
    setBusy(true);
    const result = await verifyEmailCode(email, code);
    setBusy(false);
    if (!result.ok) {
      toast.error(result.message ?? 'That code was not accepted.');
      return;
    }
    setCode('');
    await refresh();
    toast.success('Signed in.');
  };

  const handleSignOut = async () => {
    setBusy(true);
    await signOut();
    setBusy(false);
    setCodeSent(false);
    setCode('');
    await refresh();
  };

  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${what} copied.`);
    } catch {
      toast.error(`Could not copy the ${what.toLowerCase()} — select it and copy manually.`);
    }
  };

  // Shown only to a signed-in account that the server says has no access. The id
  // here is the account's own, read from its own session.
  const grantSql = user
    ? `INSERT INTO public.entitlements (user_id, plan, source, expires_at, note)
VALUES ('${user.id}', 'developer', 'admin', NULL, 'owner')
ON CONFLICT (user_id) DO UPDATE
  SET plan = 'developer', source = 'admin', expires_at = NULL;`
    : '';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Account &amp; Access</CardTitle>
        <CardDescription>
          Access is decided by the server, not by this device.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking your account…
          </p>
        ) : user === null ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Sign in to sync your access across devices, or to restore a purchase.
            </p>

            <div className="space-y-2">
              <Label htmlFor="access-email">Email address</Label>
              <Input
                id="access-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={busy}
              />
            </div>

            {codeSent && (
              <div className="space-y-2">
                <Label htmlFor="access-code">One-time code</Label>
                <Input
                  id="access-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Code from your email"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={busy}
                />
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
              {codeSent ? (
                <>
                  <Button
                    className="min-h-[44px] flex-1 gap-2"
                    onClick={handleVerify}
                    disabled={busy || code.trim().length === 0}
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Verify code
                  </Button>
                  <Button
                    variant="outline"
                    className="min-h-[44px]"
                    onClick={() => {
                      setCodeSent(false);
                      setCode('');
                    }}
                    disabled={busy}
                  >
                    Use a different email
                  </Button>
                </>
              ) : (
                <Button
                  className="min-h-[44px] flex-1 gap-2"
                  onClick={handleSendCode}
                  disabled={busy || email.trim().length === 0}
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                  Email me a one-time code
                </Button>
              )}
            </div>

            {codeSent && (
              <p className="text-sm text-muted-foreground">
                Sent to <span className="font-medium text-foreground">{email.trim().toLowerCase()}</span>.
                Codes expire quickly; request a new one if it has gone stale.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Signed in as</p>
                <p className="font-medium text-foreground">{user.email ?? 'Signed in'}</p>
              </div>
              {premium === null ? (
                <Badge variant="secondary" className="gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Checking
                </Badge>
              ) : premium ? (
                <Badge className="gap-1">
                  <Check className="h-3 w-3" />
                  Premium active
                </Badge>
              ) : (
                <Badge variant="secondary">No premium access</Badge>
              )}
            </div>

            {premium === false && (
              <div className="space-y-3 rounded-md border border-dashed p-3">
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <ShieldQuestion className="h-4 w-4" />
                  No entitlement is stored for this account yet.
                </p>
                <p className="text-sm text-muted-foreground">
                  Nothing on this device can grant access — it has to be added server-side for your
                  account id. Your id is:
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 overflow-x-auto whitespace-nowrap rounded bg-muted px-2 py-1 font-mono text-xs">
                    {user.id}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => void copy(user.id, 'User id')}
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  To grant it, run this once in the Supabase SQL editor:
                </p>
                <div className="flex items-start gap-2">
                  <pre className="flex-1 overflow-x-auto rounded bg-muted p-2 font-mono text-xs leading-relaxed">
                    {grantSql}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => void copy(grantSql, 'SQL')}
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  This block disappears on its own once the server reports access.
                </p>
              </div>
            )}

            <Button variant="outline" className="min-h-[44px] gap-2" onClick={handleSignOut} disabled={busy}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
