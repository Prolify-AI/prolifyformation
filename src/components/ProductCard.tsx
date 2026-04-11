import React, { useState } from 'react';
import { createCheckoutSession } from '../lib/stripe';
import { Button } from './ui/Button';
import { Alert } from './ui/Alert';
import type { StripeProduct } from '../stripe-config';

interface ProductCardProps {
  product: StripeProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePurchase = async () => {
    setLoading(true);
    setError('');

    try {
      const { url } = await createCheckoutSession({
        price_id: product.priceId,
        success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: window.location.href,
        mode: product.mode,
      });

      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'Failed to start checkout');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {product.mode === 'subscription' ? 'Monthly' : 'One-time'}
        </span>
      </div>
      
      {product.description && (
        <p className="text-gray-600 mb-4">{product.description}</p>
      )}
      
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-gray-900">
          ${product.price}
          {product.mode === 'subscription' && (
            <span className="text-sm font-normal text-gray-500">/month</span>
          )}
        </div>
        
        <Button
          onClick={handlePurchase}
          loading={loading}
          disabled={loading}
        >
          {product.mode === 'subscription' ? 'Subscribe' : 'Purchase'}
        </Button>
      </div>
      
      {error && (
        <div className="mt-4">
          <Alert type="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </div>
      )}
    </div>
  );
}