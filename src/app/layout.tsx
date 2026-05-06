import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";
import Navigation from "@/components/sections/navigation";
import Footer from "@/components/sections/footer";
import { PHProvider } from "@/providers/PostHogProvider";
import { PostHogPageView } from "@/components/PostHogPageView";
import { PostHogIdentify } from "@/components/PostHogIdentify";
import { Suspense } from "react";
import { PoliteChatWidget } from "@/components/chat/PoliteChatWidget";

export const metadata: Metadata = {
  title: "prolify",
  description: "prolify",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <I18nProvider>
        <PHProvider>
          <AuthProvider>
            <Suspense fallback={null}>
              <PostHogPageView />
            </Suspense>
            <PostHogIdentify />
            <Script
              id="orchids-browser-logs"
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
              strategy="afterInteractive"
              data-orchids-project-id="71eed71d-1e0c-4248-b7b3-cafb65a01c60"
            />
            <ErrorReporter />
            <Script
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
              strategy="afterInteractive"
              data-target-origin="*"
              data-message-type="ROUTE_CHANGE"
              data-include-search-params="true"
              data-only-in-iframe="true"
              data-debug="true"
              data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
            />
            <Navigation />
            {children}
            <Footer />
            <PoliteChatWidget />
            <VisualEditsMessenger />
            <Script
              id="hs-settings"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.hsConversationsSettings = { loadImmediately: false };`,
              }}
            />
            <Script
              id="hs-script-loader"
              src="//js.hs-scripts.com/51196220.js"
              strategy="afterInteractive"
            />
          </AuthProvider>
        </PHProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
