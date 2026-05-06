"use client";

import { usePostHog } from "posthog-js/react";

interface SignupProperties {
  email: string;
  plan: string;
}

interface ServiceSelectedProperties {
  service_type: string;
  llc_state: string;
  price: number;
}

interface CheckoutStartedProperties {
  cart_total: number;
  items_count: number;
  llc_state: string;
}

interface PaymentSubmittedProperties {
  amount: number;
  method: string;
  llc_state: string;
}

interface OrderCompletedProperties {
  order_id: string;
  revenue: number;
  llc_state: string;
}

export function useAnalytics() {
  const posthog = usePostHog();

  const trackEvent = (name: string, properties?: Record<string, unknown>) => {
    posthog?.capture(name, properties);
  };

  const identifyUser = (userId: string, traits?: Record<string, unknown>) => {
    posthog?.identify(userId, traits);
  };

  const resetUser = () => {
    posthog?.reset();
  };

  const trackSignup = (props: SignupProperties) => {
    posthog?.capture("user_signed_up", props);
  };

  const trackServiceSelected = (props: ServiceSelectedProperties) => {
    posthog?.capture("service_selected", props);
  };

  const trackCheckoutStarted = (props: CheckoutStartedProperties) => {
    posthog?.capture("checkout_started", props);
  };

  const trackPaymentSubmitted = (props: PaymentSubmittedProperties) => {
    posthog?.capture("payment_submitted", props);
  };

  const trackOrderCompleted = (props: OrderCompletedProperties) => {
    posthog?.capture("order_completed", {
      ...props,
      $set: { last_order_id: props.order_id, lifetime_revenue: props.revenue },
    });
  };

  return {
    trackEvent,
    identifyUser,
    resetUser,
    trackSignup,
    trackServiceSelected,
    trackCheckoutStarted,
    trackPaymentSubmitted,
    trackOrderCompleted,
  };
}
