import { makeTitle, computeLayout } from '../elementHelpers';

export const bankingLevel2Elements = [
  makeTitle('title', 'Container – Online Banking System', 760),
  ...computeLayout(
    [
      { id: 'l2-customer',   label: 'Personal Banking Customer',  color: '#bfdbfe' },
      { id: 'l2-webApp',     label: 'Web Application',            color: '#ddd6fe' },
      { id: 'l2-mobileApp',  label: 'Mobile App',                 color: '#ddd6fe' },
      { id: 'l2-spa',        label: 'Single-Page App',            color: '#ddd6fe' },
      { id: 'l2-apiApp',     label: 'API Application',            color: '#ddd6fe' },
      { id: 'l2-db',         label: 'Database',                   color: '#fde68a' },
      { id: 'l2-email',      label: 'E-mail System',              color: '#f1f5f9' },
      { id: 'l2-mainframe',  label: 'Mainframe Banking System',   color: '#f1f5f9' },
    ],
    [
      { id: 'l2-a1', from: 'l2-customer',  to: 'l2-webApp',    label: 'Visits' },
      { id: 'l2-a2', from: 'l2-customer',  to: 'l2-mobileApp', label: 'Uses' },
      { id: 'l2-a3', from: 'l2-webApp',    to: 'l2-spa',       label: 'Delivers' },
      { id: 'l2-a4', from: 'l2-spa',       to: 'l2-apiApp',    label: 'Makes API calls to' },
      { id: 'l2-a5', from: 'l2-mobileApp', to: 'l2-apiApp',    label: 'Makes API calls to' },
      { id: 'l2-a6', from: 'l2-apiApp',    to: 'l2-db',        label: 'Reads/writes' },
      { id: 'l2-a7', from: 'l2-apiApp',    to: 'l2-email',     label: 'Sends emails using' },
      { id: 'l2-a8', from: 'l2-apiApp',    to: 'l2-mainframe', label: 'Reads/writes account data' },
    ],
  ),
];

