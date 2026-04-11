"use client";

import { useEffect } from "react";
import { Megaphone, Eye, MousePointerClick, DollarSign, TrendingUp, ExternalLink } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

function MetaLogo() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
      <path
        d="M8.5 28.5C8.5 31.5 10 33.5 12 33.5C13.7 33.5 14.8 32.5 16.5 30C17.9 27.9 19.5 24.9 20.5 23.2L18 19.2C16.1 22.2 14.1 25.4 13 27.2C11.7 29.3 11 29.8 10.2 29.8C9.3 29.8 8.5 28.5 8.5 26.5V28.5Z"
        fill="#ffffff"
      />
      <path
        d="M12 17.5C10.3 19.8 8.5 23 8.5 26.5V28.5C8.5 25.5 9.8 23 12 17.5Z"
        fill="#ffffff"
        fillOpacity="0.7"
      />
      <path
        d="M20.3 15C19.1 15 18 16 16.8 17.8C15.3 20.1 12 26 12 17.5C10 20.1 8.5 23.5 8.5 26.5C8.5 31.5 10.9 34.5 14 34.5C15.9 34.5 17.5 33.5 19.5 30.5C20.8 28.6 22.5 25.5 23.8 23.2C26.1 19.5 27.8 17 30.2 17C32.5 17 34 19.5 34 22.5C34 25 32.5 27.5 31.5 27.5C30.5 27.5 30 26.5 30 25C30 22 31.5 21 31.5 21C30 21.5 27.5 23.5 27.5 26.5C27.5 29.5 29 31.5 31.5 31.5C34.5 31.5 38 28 38 22.5C38 17 35 13.5 30.5 13.5C27 13.5 24.5 15.8 22 20L20.3 15Z"
        fill="#ffffff"
      />
    </svg>
  );
}

function GoogleAdsLogo() {
  return (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
      <path d="M31.8 10L20 30.2l6.1 10.5L44 10H31.8z" fill="#FBBC04" />
      <path d="M16.2 10H4L20 37.4l6.1-10.5L16.2 10z" fill="#4285F4" />
      <path d="M26.1 37.4H38.3c2.8 0 4.5-3 3.1-5.4L35.3 21 26.1 37.4z" fill="#34A853" />
    </svg>
  );
}

function TikTokLogo() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
      <path
        d="M34.8 10.6c-1.9-1.3-3.3-3.3-3.8-5.6H27v25.5c0 2.7-2.2 4.9-4.9 4.9s-4.9-2.2-4.9-4.9 2.2-4.9 4.9-4.9c.5 0 .9.1 1.3.2v-4.2c-.4-.1-.9-.1-1.3-.1-5 0-9.1 4.1-9.1 9.1s4.1 9.1 9.1 9.1 9.1-4.1 9.1-9.1V18.1c1.9 1.3 4.2 2.1 6.6 2.1v-4.2c-1.3-.1-2.5-.5-3-.8v.4c0 .1-.1.2-.1.3 0 0 0-.4.1-4.3-.1-.3-.1-.7-.1-1z"
        fill="#ffffff"
      />
      <path
        d="M34.8 10.6c-1.9-1.3-3.3-3.3-3.8-5.6H27v25.5c0 2.7-2.2 4.9-4.9 4.9s-4.9-2.2-4.9-4.9 2.2-4.9 4.9-4.9c.5 0 .9.1 1.3.2v-4.2c-.4-.1-.9-.1-1.3-.1-5 0-9.1 4.1-9.1 9.1s4.1 9.1 9.1 9.1 9.1-4.1 9.1-9.1V18.1c1.9 1.3 4.2 2.1 6.6 2.1v-4.2c-1.3-.1-2.5-.5-3-.8"
        fill="#69C9D0"
        fillOpacity="0.5"
      />
    </svg>
  );
}

const PLATFORMS = [
  {
    name: "Meta Ads",
    description: "Facebook & Instagram campaigns",
    Logo: MetaLogo,
    bg: "bg-[#1877F2]",
    href: "https://business.facebook.com",
  },
  {
    name: "Google Ads",
    description: "Search, Display & YouTube",
    Logo: GoogleAdsLogo,
    bg: "bg-white border border-gray-200",
    href: "https://ads.google.com",
  },
  {
    name: "TikTok Ads",
    description: "Short-form video campaigns",
    Logo: TikTokLogo,
    bg: "bg-black",
    href: "https://ads.tiktok.com",
  },
];

const TIPS = [
  {
    title: "Start with organic",
    body: "Build a content presence on LinkedIn and Instagram before investing in paid ads.",
  },
  {
    title: "Track your CAC",
    body: "Customer Acquisition Cost = Total Ad Spend ÷ New Customers. Keep it below your LTV.",
  },
  {
    title: "Retargeting first",
    body: "Retargeting visitors who already know your brand gives you the best ROAS to start.",
  },
];

export default function AdsSection() {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent("analytics_ads_viewed");
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#FFC107] to-[#FFB300] flex items-center justify-center shadow-lg">
          <Megaphone className="h-7 w-7 text-black" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-black dark:text-white">Growth &amp; Advertising</h2>
          <p className="text-sm text-black/60 dark:text-white/60">Track your marketing campaigns and ROI</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Impressions", icon: Eye, value: "—" },
          { label: "Clicks", icon: MousePointerClick, value: "—" },
          { label: "Ad Spend", icon: DollarSign, value: "—" },
          { label: "ROAS", icon: TrendingUp, value: "—" },
        ].map(({ label, icon: Icon, value }) => (
          <div
            key={label}
            className="p-5 bg-white dark:bg-black border-2 border-black/20 dark:border-white/20 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-4 w-4 text-[#FFC107]" />
              <span className="text-xs font-medium text-black/60 dark:text-white/60">{label}</span>
            </div>
            <p className="text-2xl font-bold text-black/30 dark:text-white/30">{value}</p>
          </div>
        ))}
      </div>

      <div className="border-2 border-black dark:border-white rounded-xl overflow-hidden bg-white dark:bg-black">
        <div className="px-6 py-4 border-b-2 border-black/10 dark:border-white/10 bg-[#FFC107]/5">
          <h3 className="text-base font-bold text-black dark:text-white">Connect an Ad Platform</h3>
          <p className="text-sm text-black/60 dark:text-white/60 mt-0.5">
            Link your advertising accounts to see live campaign metrics here
          </p>
        </div>
        <div className="divide-y divide-black/5 dark:divide-white/5">
          {PLATFORMS.map((platform) => (
            <div
              key={platform.name}
              className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg ${platform.bg} flex items-center justify-center shrink-0`}>
                  <platform.Logo />
                </div>
                <div>
                  <p className="font-semibold text-black dark:text-white text-sm">{platform.name}</p>
                  <p className="text-xs text-black/50 dark:text-white/50">{platform.description}</p>
                </div>
              </div>
              <a
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-black/20 dark:border-white/20 text-xs font-semibold text-black dark:text-white hover:border-[#FFC107] hover:bg-[#FFC107]/10 transition-colors"
              >
                Open
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="border-2 border-black dark:border-white rounded-xl p-6 bg-white dark:bg-black">
        <h3 className="text-base font-bold text-black dark:text-white mb-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#FFC107]" />
          Marketing Tips for LLC Owners
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIPS.map((tip) => (
            <div
              key={tip.title}
              className="p-4 rounded-xl border-2 border-black/10 dark:border-white/10 bg-[#FFC107]/5 hover:border-[#FFC107] transition-colors"
            >
              <p className="font-semibold text-black dark:text-white text-sm mb-1">{tip.title}</p>
              <p className="text-xs text-black/60 dark:text-white/60 leading-relaxed">{tip.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
