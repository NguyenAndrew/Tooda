import { makeTitle, computeLayout } from '../elementHelpers';

export const ecommerceLevel1Elements = [
  makeTitle('title', 'System Context – E-Commerce Platform', 760),
  ...computeLayout(
    [
      { id: 'l1-customer',  label: 'Customer',              color: '#bfdbfe' },
      { id: 'l1-seller',    label: 'Seller',                color: '#bfdbfe' },
      { id: 'l1-ecommerce', label: 'E-Commerce Platform',   color: '#bbf7d0' },
      { id: 'l1-payment',   label: 'Payment Gateway',       color: '#f1f5f9' },
      { id: 'l1-shipping',  label: 'Shipping Provider',     color: '#f1f5f9' },
      { id: 'l1-email',     label: 'E-mail System',         color: '#f1f5f9' },
    ],
    [
      { id: 'l1-a1', from: 'l1-customer',  to: 'l1-ecommerce', label: 'Browses products and places orders using' },
      { id: 'l1-a2', from: 'l1-seller',    to: 'l1-ecommerce', label: 'Lists products and manages inventory using' },
      { id: 'l1-a3', from: 'l1-ecommerce', to: 'l1-payment',   label: 'Processes payments via' },
      { id: 'l1-a4', from: 'l1-ecommerce', to: 'l1-shipping',  label: 'Dispatches orders via' },
      { id: 'l1-a5', from: 'l1-ecommerce', to: 'l1-email',     label: 'Sends notifications using' },
    ],
  ),
];

