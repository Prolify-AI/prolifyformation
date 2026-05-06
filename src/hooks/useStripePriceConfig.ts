"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export interface StripePriceConfig {
  plan_key: string;
  plan_name: string;
  price_id: string;
  mode: string;
}

let cache: StripePriceConfig[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000;

export function useStripePriceConfig() {
  const [config, setConfig] = useState<StripePriceConfig[]>(cache ?? []);
  const [loading, setLoading] = useState(cache === null);

  useEffect(() => {
    if (cache && Date.now() - cacheTime < CACHE_TTL) {
      setConfig(cache);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("stripe_price_config")
        .select("plan_key, plan_name, price_id, mode");
      if (!cancelled && data) {
        cache = data;
        cacheTime = Date.now();
        setConfig(data);
      }
      if (!cancelled) setLoading(false);
    })();

    return () => { cancelled = true; };
  }, []);

  const getPriceId = (planKey: string): string =>
    config.find((c) => c.plan_key === planKey)?.price_id ?? "";

  return { config, loading, getPriceId };
}
