import { makeTitle, computeLayout } from '../elementHelpers';

export const ridesharingLevel1Elements = [
  makeTitle('title', 'System Context – Ride-Sharing App', 760),
  ...computeLayout(
    [
      { id: 'l1-rider',       label: 'Rider',                color: '#bfdbfe' },
      { id: 'l1-driver',      label: 'Driver',               color: '#bfdbfe' },
      { id: 'l1-ridesharing', label: 'Ride-Sharing App',     color: '#bbf7d0' },
      { id: 'l1-maps',        label: 'Maps & Routing API',   color: '#f1f5f9' },
      { id: 'l1-payment',     label: 'Payment Gateway',      color: '#f1f5f9' },
      { id: 'l1-sms',         label: 'SMS Provider',         color: '#f1f5f9' },
    ],
    [
      { id: 'l1-a1', from: 'l1-rider',       to: 'l1-ridesharing', label: 'Requests and pays for rides using' },
      { id: 'l1-a2', from: 'l1-driver',      to: 'l1-ridesharing', label: 'Accepts trips and receives payouts via' },
      { id: 'l1-a3', from: 'l1-ridesharing', to: 'l1-maps',        label: 'Gets routes and ETAs from' },
      { id: 'l1-a4', from: 'l1-ridesharing', to: 'l1-payment',     label: 'Processes fares via' },
      { id: 'l1-a5', from: 'l1-ridesharing', to: 'l1-sms',         label: 'Sends SMS notifications using' },
    ],
  ),
];

