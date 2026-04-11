import { usePostHog } from "posthog-js/react";

export function useAnalytics() {
  const posthog = usePostHog();

  const trackEvent = (name: string, properties?: object) => {
    posthog?.capture(name, properties);
  };

  const identifyUser = (userId: string, traits?: object) => {
    posthog?.identify(userId, traits);
  };

  const resetUser = () => {
    posthog?.reset();
  };

  return { trackEvent, identifyUser, resetUser };
}
