import { useCallback, useEffect, useState } from 'react';
import { configure, getEntitlement } from '@/lib/appbuild/revenuecat';

/** Gate premium content on an active RevenueCat entitlement. */
export function usePremiumEntitlement(entitlementId = 'premium') {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await configure();
      const ent = await getEntitlement(entitlementId);
      setIsPremium(!!ent);
    } catch {
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  }, [entitlementId]);

  useEffect(() => {
    let active = true;
    (async () => {
      await refresh();
      if (!active) return;
    })();
    return () => {
      active = false;
    };
  }, [refresh]);

  return { isPremium, loading, refresh };
}
