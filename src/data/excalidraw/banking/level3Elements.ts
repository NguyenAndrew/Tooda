import { makeTitle, computeLayout } from '../elementHelpers';

export const bankingLevel3Elements = [
  makeTitle('title', 'Component – API Application', 760),
  ...computeLayout(
    [
      { id: 'l3-spa',                label: 'Single-Page App',           color: '#f1f5f9' },
      { id: 'l3-mobileApp',          label: 'Mobile App',                color: '#f1f5f9' },
      { id: 'l3-authController',     label: 'Auth Controller',           color: '#e0f2fe' },
      { id: 'l3-accountsController', label: 'Accounts Controller',       color: '#e0f2fe' },
      { id: 'l3-paymentsController', label: 'Payments Controller',       color: '#e0f2fe' },
      { id: 'l3-authService',        label: 'Auth Service',              color: '#e0f2fe' },
      { id: 'l3-accountsService',    label: 'Accounts Service',          color: '#e0f2fe' },
      { id: 'l3-paymentsService',    label: 'Payments Service',          color: '#e0f2fe' },
      { id: 'l3-emailService',       label: 'E-mail Service',            color: '#e0f2fe' },
      { id: 'l3-db',                 label: 'Database',                  color: '#fef3c7' },
      { id: 'l3-email',              label: 'E-mail System',             color: '#f1f5f9' },
      { id: 'l3-mainframe',          label: 'Mainframe Banking System',  color: '#f1f5f9' },
    ],
    [
      { id: 'l3-a1',  from: 'l3-spa',                to: 'l3-authController',     label: 'Calls' },
      { id: 'l3-a2',  from: 'l3-spa',                to: 'l3-accountsController', label: 'Calls' },
      { id: 'l3-a3',  from: 'l3-spa',                to: 'l3-paymentsController', label: 'Calls' },
      { id: 'l3-a4',  from: 'l3-mobileApp',          to: 'l3-authController',     label: 'Calls' },
      { id: 'l3-a5',  from: 'l3-mobileApp',          to: 'l3-accountsController', label: 'Calls' },
      { id: 'l3-a6',  from: 'l3-mobileApp',          to: 'l3-paymentsController', label: 'Calls' },
      { id: 'l3-a7',  from: 'l3-authController',     to: 'l3-authService',        label: 'Uses' },
      { id: 'l3-a8',  from: 'l3-accountsController', to: 'l3-accountsService',    label: 'Uses' },
      { id: 'l3-a9',  from: 'l3-paymentsController', to: 'l3-paymentsService',    label: 'Uses' },
      { id: 'l3-a10', from: 'l3-paymentsService',    to: 'l3-emailService',       label: 'Uses' },
      { id: 'l3-a11', from: 'l3-authService',        to: 'l3-db',                 label: 'Reads/writes' },
      { id: 'l3-a12', from: 'l3-accountsService',    to: 'l3-db',                 label: 'Reads/writes' },
      { id: 'l3-a13', from: 'l3-paymentsService',    to: 'l3-db',                 label: 'Reads/writes' },
      { id: 'l3-a14', from: 'l3-emailService',       to: 'l3-email',              label: 'Sends e-mail using' },
      { id: 'l3-a15', from: 'l3-accountsService',    to: 'l3-mainframe',          label: 'Reads account data from' },
      { id: 'l3-a16', from: 'l3-paymentsService',    to: 'l3-mainframe',          label: 'Submits payments to' },
    ],
  ),
];

