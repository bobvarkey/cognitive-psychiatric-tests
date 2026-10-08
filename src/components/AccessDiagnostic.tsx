import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { currentAuthUser, type AuthUser } from '@/lib/entitlement';

/**
 * What the gate shows when it has closed with no way through.
 *
 * Developer access is an admin grant keyed to this account's auth user id, and
 * the screen that normally reports that id — Settings -> Account — sits behind
 * this same gate. Without this, a signed-in owner who has not been granted yet
 * cannot read the id an administrator has to grant, and so cannot get in at all.
 *
 * The id comes from the live session, never from a typed value, a build
 * constant or a guess. With no session there is no id to show, so this renders
 * the sign-in prompt alone rather than a placeholder that could be copied into
 * a grant by mistake.
 */
export const AccessDiagnostic = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let live = true;
    void currentAuthUser().then((who) => {
      if (live) setUser(who);
    });
    return () => {
      live = false;
    };
  }, []);

  const copyId = async () => {
    if (!user) return;
    try {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard permission can be refused; the id is on screen either way.
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[105] border-t border-border bg-background/95 backdrop-blur p-4">
      <div className="mx-auto max-w-md space-y-3 text-left">
        <p className="text-xs font-semibold text-foreground">Access diagnostic</p>

        {user ? (
          <>
            <p className="text-xs text-muted-foreground">
              This account has no entitlement yet{user.email ? ` (${user.email})` : ''}. Access
              is granted to this auth user id, and only to this one:
            </p>
            <div className="flex items-center gap-2">
              <code
                data-testid="auth-user-id"
                className="flex-1 truncate rounded-lg border border-border bg-muted px-3 py-2 text-xs text-foreground"
              >
                {user.id}
              </code>
              <button
                type="button"
                onClick={() => void copyId()}
                aria-label="Copy auth user id"
                className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Run this once in the Supabase SQL editor, then sign out and back in:
            </p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-3 text-[10px] leading-relaxed text-foreground">
{`INSERT INTO public.entitlements (user_id, plan, source, expires_at, note)
VALUES ('${user.id}', 'developer', 'admin', NULL, 'owner')
ON CONFLICT (user_id) DO UPDATE
  SET plan = 'developer', source = 'admin', expires_at = NULL;`}
            </pre>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">
            Not signed in. Sign in with your email one-time code and this will show the auth user
            id an administrator has to grant.
          </p>
        )}
      </div>
    </div>
  );
};
