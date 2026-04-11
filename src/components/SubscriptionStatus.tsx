import React from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { Alert } from './ui/Alert';

export function SubscriptionStatus() {
  const { subscription, product, loading } = useSubscription();

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 h-16 rounded-lg"></div>
    );
  }

  if (!subscription || subscription.subscription_status === 'not_started') {
    return (
      <Alert type="info">
        You don't have an active subscription. Browse our plans to get started.
      </Alert>
    );
  }

  const isActive = subscription.subscription_status === 'active';
  const isPastDue = subscription.subscription_status === 'past_due';
  const isCanceled = subscription.subscription_status === 'canceled';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Status</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Plan:</span>
          <span className="font-medium">{product?.name || 'Unknown Plan'}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Status:</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isActive ? 'bg-green-100 text-green-800' :
            isPastDue ? 'bg-yellow-100 text-yellow-800' :
            isCanceled ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {subscription.subscription_status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        
        {subscription.current_period_end && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              {subscription.cancel_at_period_end ? 'Expires:' : 'Next billing:'}
            </span>
            <span className="font-medium">
              {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
            </span>
          </div>
        )}
        
        {subscription.cancel_at_period_end && (
          <Alert type="warning">
            Your subscription will be canceled at the end of the current billing period.
          </Alert>
        )}
      </div>
    </div>
  );
}