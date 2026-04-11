export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  // Formation Plans (one-time)
  {
    id: 'prod_UA7kE93wILb9rP',
    priceId: 'price_1TBnVLPfALVp6q7WUslzqose',
    name: 'Formation Elite',
    description: 'International founders & premium needs',
    price: 499.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_UA7i1MxzYEkEpK',
    priceId: 'price_1TBnTMPfALVp6q7WAoCASehf',
    name: 'Formation Growth',
    description: 'Serious founders wanting a complete launch',
    price: 299.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_UA7b0GlnSPx3qS',
    priceId: 'price_1TBnMePfALVp6q7WOMOjzA6F',
    name: 'Formation Starter',
    description: 'US founders wanting the essentials done right',
    price: 149.00,
    currency: 'usd',
    mode: 'payment'
  },
  // Management Plans (subscriptions)
  // TO CONFIGURE: Replace each priceId below with the real Stripe Price ID from your Stripe dashboard.
  // Stripe Dashboard → Products → [Plan Name] → Copy the price ID (starts with price_1...)
  {
    id: 'management-starter-id',
    priceId: 'REPLACE_WITH_MANAGEMENT_STARTER_MONTHLY_PRICE_ID',
    name: 'Management Starter Monthly',
    description: 'Solo founders with early revenue',
    price: 49.00,
    currency: 'usd',
    mode: 'subscription'
  },
  {
    id: 'management-starter-annual-id',
    priceId: 'REPLACE_WITH_MANAGEMENT_STARTER_ANNUAL_PRICE_ID',
    name: 'Management Starter Annual',
    description: 'Solo founders with early revenue',
    price: 39.00,
    currency: 'usd',
    mode: 'subscription'
  },
  {
    id: 'management-growth-id',
    priceId: 'REPLACE_WITH_MANAGEMENT_GROWTH_MONTHLY_PRICE_ID',
    name: 'Management Growth Monthly',
    description: 'Growing businesses',
    price: 149.00,
    currency: 'usd',
    mode: 'subscription'
  },
  {
    id: 'management-growth-annual-id',
    priceId: 'REPLACE_WITH_MANAGEMENT_GROWTH_ANNUAL_PRICE_ID',
    name: 'Management Growth Annual',
    description: 'Growing businesses',
    price: 119.00,
    currency: 'usd',
    mode: 'subscription'
  },
  {
    id: 'management-elite-id',
    priceId: 'REPLACE_WITH_MANAGEMENT_ELITE_MONTHLY_PRICE_ID',
    name: 'Management Elite Monthly',
    description: 'Established companies needing full service',
    price: 399.00,
    currency: 'usd',
    mode: 'subscription'
  },
  {
    id: 'management-elite-annual-id',
    priceId: 'REPLACE_WITH_MANAGEMENT_ELITE_ANNUAL_PRICE_ID',
    name: 'Management Elite Annual',
    description: 'Established companies needing full service',
    price: 319.00,
    currency: 'usd',
    mode: 'subscription'
  },
  {
    id: 'prod_U8u7Ik9ePGudDo',
    priceId: 'price_1TAcJ6PfALVp6q7WcX0KT0DI',
    name: 'Virtual Office Unlimited',
    description: 'Address + Unlimited scans',
    price: 59.00,
    currency: 'usd',
    mode: 'subscription'
  },
  {
    id: 'prod_U8u5XlVogTXQLz',
    priceId: 'price_1TAcHEPfALVp6q7WMcrUtuN3',
    name: 'Virtual Office Pro',
    description: 'Address + 25 scans',
    price: 199.00,
    currency: 'usd',
    mode: 'subscription'
  },
  {
    id: 'prod_U8u20WzchUsuNt',
    priceId: 'price_1TAcEsPfALVp6q7W3ZgwCJA3',
    name: 'Virtual Office with Mail Scanning',
    description: 'Address + 10 scans',
    price: 149.00,
    currency: 'usd',
    mode: 'subscription'
  },
  {
    id: 'prod_U8u0uLCRxM74O8',
    priceId: 'price_1TAcCqPfALVp6q7WqW4gasdn',
    name: 'Mail Scanning Only',
    description: 'No address',
    price: 79.00,
    currency: 'usd',
    mode: 'subscription'
  },
  {
    id: 'prod_U8rq8d36RwiLiZ',
    priceId: 'price_1TAa7EPfALVp6q7Wvvv9D0sh',
    name: 'DC Agent for Service of Process',
    description: '',
    price: 149.00,
    currency: 'usd',
    mode: 'subscription'
  },
  {
    id: 'prod_U8rYUmhqFq8jO4',
    priceId: 'price_1TAZpBPfALVp6q7WujKCh5Cc',
    name: 'Registered Agent Service',
    description: '',
    price: 129.00,
    currency: 'usd',
    mode: 'subscription'
  },

  // One-time Payments
  {
    id: 'prod_U8vpON7c0p9nu7',
    priceId: 'price_1TAdyCPfALVp6q7WByyZwYGG',
    name: 'Amended Annual Report',
    description: '',
    price: 99.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8vm8XphY0rDDH',
    priceId: 'price_1TAduUPfALVp6q7W7znUE5Te',
    name: 'Business Records Copies',
    description: '',
    price: 99.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8vDvYBYDKNz3D',
    priceId: 'price_1TAdMrPfALVp6q7WgBBe9OFg',
    name: 'Domestication Filing',
    description: '',
    price: 299.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8vBUtIUrr0By9',
    priceId: 'price_1TAdKlPfALVp6q7WAn5yvn4z',
    name: 'Publication Service',
    description: '',
    price: 199.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8v8MnIfMlPkhh',
    priceId: 'price_1TAdHqPfALVp6q7WKzxnzXKm',
    name: 'Business Reinstatement Filing',
    description: '',
    price: 199.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8uf8xh419FgK0',
    priceId: 'price_1TAcqRPfALVp6q7WXQBy0kZq',
    name: 'DBA Complete Package',
    description: 'Filing + Publication',
    price: 249.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8udyDiG068cKy',
    priceId: 'price_1TAcoJPfALVp6q7W5aAup7pN',
    name: 'Trade Name Publication Service',
    description: '',
    price: 149.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8uaxkLMMFbpsn',
    priceId: 'price_1TAcl3PfALVp6q7W5AzqXnn2',
    name: 'DBA Trade Name Filing',
    description: '',
    price: 149.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8uWY8ltTgpvRE',
    priceId: 'price_1TAchWPfALVp6q7WiCgmm3tI',
    name: 'Corporate Kit',
    description: 'Book + Seal + Certificates x10',
    price: 99.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8uVKK1TDxZxYI',
    priceId: 'price_1TAcg4PfALVp6q7WXpi1SL4f',
    name: 'Certificates x10',
    description: '',
    price: 29.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8uPTH3zYt4DXN',
    priceId: 'price_1TAcasPfALVp6q7WYE40YRjW',
    name: 'Corporate Book and Seal',
    description: '',
    price: 79.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8uMpITQ0MeHmq',
    priceId: 'price_1TAcXZPfALVp6q7WZj8eUkte',
    name: 'Corporate Book',
    description: '',
    price: 49.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8uKyvCiIlAocE',
    priceId: 'price_1TAcVPPfALVp6q7WSazSQu0C',
    name: 'Corporate Seal',
    description: '',
    price: 39.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8uB7f43gzSC4W',
    priceId: 'price_1TAcNZPfALVp6q7WxdCnBgY7',
    name: 'GoBook and Seal',
    description: '',
    price: 79.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8uAS5i4rZMHe5',
    priceId: 'price_1TAcLqPfALVp6q7W11KbLOLj',
    name: 'GoBook',
    description: '',
    price: 49.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8tyiNJKKUxaBl',
    priceId: 'price_1TAcA6PfALVp6q7WOfpQ9nE8',
    name: 'Business Registration – Withdrawal Filing',
    description: '',
    price: 149.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8tw4oAFVjoTaZ',
    priceId: 'price_1TAc8SPfALVp6q7Wt5kZAuqJ',
    name: 'Company Dissolution Filing',
    description: '',
    price: 149.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8tuuUm1gM2rdM',
    priceId: 'price_1TAc6vPfALVp6q7WZKMKFztb',
    name: 'Renewal Filings',
    description: 'Annual/Biennial Report',
    price: 99.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8ttSPgcvfmSE9',
    priceId: 'price_1TAc5nPfALVp6q7WCnAcZQwb',
    name: 'Initial Report Filing',
    description: '',
    price: 99.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8tqsATjPV0n7a',
    priceId: 'price_1TAc34PfALVp6q7WEd1MbXl4',
    name: 'Certified Copy',
    description: '',
    price: 99.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8tFUeeDJq5WH1',
    priceId: 'price_1TAbSmPfALVp6q7WbGQL5Lp4',
    name: 'Amendment',
    description: '',
    price: 149.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8sKVJTY9HnpSH',
    priceId: 'price_1TAaZmPfALVp6q7WYvsJ6ZHS',
    name: 'Certificate of Good Standing',
    description: '',
    price: 99.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8sGsr8UFhllNV',
    priceId: 'price_1TAaWLPfALVp6q7WE62qHPrs',
    name: 'Apostille',
    description: '',
    price: 599.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8sDs6b0jRFDyh',
    priceId: 'price_1TAaTXPfALVp6q7W5dy493Yj',
    name: 'Foreign Registration',
    description: '',
    price: 199.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8s8074PnXvrMb',
    priceId: 'price_1TAaOEPfALVp6q7WQmE3UIB4',
    name: 'Beneficial Ownership Filing Amendment',
    description: '',
    price: 99.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8s5do9Zu1zD8R',
    priceId: 'price_1TAaL9PfALVp6q7WtZa0uLxI',
    name: 'Beneficial Ownership Filing',
    description: '',
    price: 99.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8s31JR4JPrsOy',
    priceId: 'price_1TAaJOPfALVp6q7WZqxaLCdb',
    name: 'S Corporation Election',
    description: '',
    price: 199.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8s1WNI6v88lsl',
    priceId: 'price_1TAaH6PfALVp6q7WNKhHtQXA',
    name: 'EIN Amendment: 8822-B',
    description: '',
    price: 99.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8rw4F18ngheNa',
    priceId: 'price_1TAaCkPfALVp6q7Wz3dZIUlO',
    name: 'EIN – Tax ID Number for Non-US Citizens',
    description: '',
    price: 249.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8rtE1ecTXB130',
    priceId: 'price_1TAa9KPfALVp6q7WBsCfq6rY',
    name: 'EIN – Tax ID Number',
    description: '',
    price: 79.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8rnNsb1Y3qHpf',
    priceId: 'price_1TAa41PfALVp6q7W9ugBVto8',
    name: 'BOC-3 Blanket Agent Service',
    description: '',
    price: 149.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8rhN9JB2vy8J8',
    priceId: 'price_1TAZy1PfALVp6q7WEyUdtOnq',
    name: 'Registered Agent Resignation Filing',
    description: '',
    price: 99.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8rfk5ZcPAPUWF',
    priceId: 'price_1TAZw2PfALVp6q7WSf8RN0rq',
    name: 'Change Registered Agent Filing',
    description: '',
    price: 75.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8rcpnrRLV3ad8',
    priceId: 'price_1TAZtaPfALVp6q7WrV0nkb0C',
    name: 'Business Formation Service',
    description: '',
    price: 149.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8rV2HDzXMWbTF',
    priceId: 'price_1TAZm1PfALVp6q7WkDMh0wwX',
    name: 'Operating Agreement Template',
    description: 'Protect your business with a customized operating agreement',
    price: 49.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8rSWtwwQgvuf9',
    priceId: 'price_1TAZjPPfALVp6q7WUaffKlLH',
    name: 'Initial Report Filing',
    description: 'Your state requires an initial report within days of formation — we\'ll handle it',
    price: 99.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8rNft2lQpqOUa',
    priceId: 'price_1TAZelPfALVp6q7WIyFQo6Od',
    name: 'Rush Processing',
    description: 'Get your LLC documents in 1–2 business days',
    price: 79.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8rJTmcAyC0wLa',
    priceId: 'price_1TAZbLPfALVp6q7WFtv5nSuL',
    name: 'Virtual Office + Mail Scanning',
    description: 'Use a professional US business address — required by many banks and payment processors',
    price: 149.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8rGA7gg9ZByCz',
    priceId: 'price_1TAZXaPfALVp6q7WC4kTmZLE',
    name: 'BOI / CTA Filing',
    description: 'Federally required for most new businesses — file within 90 days of formation',
    price: 99.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8rC5ToB0vRcT8',
    priceId: 'price_1TAZTxPfALVp6q7WfAFxjSan',
    name: 'EIN without SSN',
    description: 'Get your EIN without a Social Security Number — we handle the IRS process for you',
    price: 249.00,
    currency: 'usd',
    mode: 'payment'
  },
  {
    id: 'prod_U8r2BU1LTw0gcf',
    priceId: 'price_1TAZKdPfALVp6q7WFmY3KJO9',
    name: 'EIN with SSN',
    description: 'Required to open a US bank account',
    price: 79.00,
    currency: 'usd',
    mode: 'payment'
  }
];

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}

export function getSubscriptionProducts(): StripeProduct[] {
  return stripeProducts.filter(product => product.mode === 'subscription');
}

export function getOneTimeProducts(): StripeProduct[] {
  return stripeProducts.filter(product => product.mode === 'payment');
}