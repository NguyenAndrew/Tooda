import { makeTitle, computeLayout } from '../elementHelpers';

export const bankingLevel1Elements = [
  makeTitle('title', 'System Context – Online Banking System', 760),
  ...computeLayout(
    [
      { id: 'l1-customer',      label: 'Personal Banking Customer',  color: '#bfdbfe' },
      { id: 'l1-staff',         label: 'Bank Staff',                 color: '#bfdbfe' },
      { id: 'l1-onlineBanking', label: 'Online Banking System',      color: '#bbf7d0' },
      { id: 'l1-email',         label: 'E-mail System',              color: '#f1f5f9' },
      { id: 'l1-mainframe',     label: 'Mainframe Banking System',   color: '#f1f5f9' },
    ],
    [
      { id: 'l1-a1', from: 'l1-customer',      to: 'l1-onlineBanking', label: 'Views account balances and makes payments using' },
      { id: 'l1-a2', from: 'l1-staff',         to: 'l1-onlineBanking', label: 'Manages customer accounts and support requests using' },
      { id: 'l1-a3', from: 'l1-onlineBanking', to: 'l1-email',         label: 'Sends e-mail notifications using' },
      { id: 'l1-a4', from: 'l1-onlineBanking', to: 'l1-mainframe',     label: 'Gets account and transaction data from' },
    ],
  ),
];

