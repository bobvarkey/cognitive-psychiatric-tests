import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2, RefreshCw } from 'lucide-react';
import {
  configure,
  getOfferings,
  purchasePackage,
  restorePurchases,
  isNativePurchasesAvailable,
  type RcPackage,
} from '@/lib/appbuild/revenuecat';
import { usePremiumEntitlement } from '@/hooks/usePremiumEntitlement';

interface PaywallProps {
  entitlementId?: string;
  onPurchased?: () => void;
}

export const Paywall = ({ entitlementId = 'premium', onPurchased }: PaywallProps) => {
  const [packages, setPackages] = useState<RcPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { isPremium, refresh } = usePremiumEntitlement(entitlementId);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const ok = await configure();
        if (!ok) {
          if (active) setMessage('In-app purchases are only available in the mobile app.');
          return;
        }
        const pkgs = await getOfferings();
        if (active) setPackages(pkgs);
      } catch (e: any) {
        if (active) setMessage(e?.message ?? 'Could not load subscription options.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handlePurchase = async (pkg: RcPackage) => {
    setBusyId(pkg.identifier);
    setMessage(null);
    try {
      await purchasePackage(pkg);
      await refresh();
      setMessage('Purchase complete. Thank you!');
      onPurchased?.();
    } catch (e: any) {
      if (!e?.userCancelled) setMessage(e?.message ?? 'Purchase failed.');
    } finally {
      setBusyId(null);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    setMessage(null);
    try {
      await restorePurchases();
      await refresh();
      setMessage('Purchases restored.');
    } catch (e: any) {
      setMessage(e?.message ?? 'Nothing to restore.');
    } finally {
      setRestoring(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isPremium ? 'Premium active' : 'Upgrade to Premium'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading plans…
          </div>
        )}

        {!loading && packages.length === 0 && !isNativePurchasesAvailable() && (
          <p className="text-sm text-muted-foreground">
            Subscriptions are managed in the iOS and Android apps.
          </p>
        )}

        <div className="space-y-3">
          {packages.map((pkg) => (
            <button
              key={pkg.identifier}
              onClick={() => handlePurchase(pkg)}
              disabled={busyId !== null}
              className="w-full text-left p-4 rounded-xl border transition hover:border-primary disabled:opacity-60"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">{pkg.title || pkg.identifier}</div>
                  {pkg.period && (
                    <div className="text-xs text-muted-foreground">{pkg.period}</div>
                  )}
                </div>
                <div className="flex items-center gap-2 font-bold">
                  {busyId === pkg.identifier ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    pkg.priceString
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {isPremium && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Check className="h-4 w-4" /> Premium entitlement is active.
          </div>
        )}

        {message && <p className="text-sm text-muted-foreground">{message}</p>}

        <Button
          variant="outline"
          className="w-full"
          onClick={handleRestore}
          disabled={restoring}
        >
          {restoring ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Restore purchases
        </Button>
      </CardContent>
    </Card>
  );
};

export default Paywall;
