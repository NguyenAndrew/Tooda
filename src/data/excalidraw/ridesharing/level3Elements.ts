import { makeTitle, computeLayout } from '../elementHelpers';

export const ridesharingLevel3Elements = [
  makeTitle('title', 'Component – API Server', 760),
  ...computeLayout(
    [
      { id: 'l3-riderApp',            label: 'Rider App',              color: '#f1f5f9' },
      { id: 'l3-driverApp',           label: 'Driver App',             color: '#f1f5f9' },
      { id: 'l3-tripController',      label: 'Trip Controller',        color: '#e0f2fe' },
      { id: 'l3-tripService',         label: 'Trip Service',           color: '#e0f2fe' },
      { id: 'l3-matchingService',     label: 'Matching Service',       color: '#e0f2fe' },
      { id: 'l3-paymentService',      label: 'Payment Service',        color: '#e0f2fe' },
      { id: 'l3-notificationService', label: 'Notification Service',   color: '#e0f2fe' },
      { id: 'l3-tripRepository',      label: 'Trip Repository',        color: '#e0f2fe' },
      { id: 'l3-db',                  label: 'Database',               color: '#fef3c7' },
      { id: 'l3-cache',               label: 'Cache',                  color: '#fef3c7' },
      { id: 'l3-payment',             label: 'Payment Gateway',        color: '#f1f5f9' },
      { id: 'l3-sms',                 label: 'SMS Provider',           color: '#f1f5f9' },
    ],
    [
      { id: 'l3-a1',  from: 'l3-riderApp',            to: 'l3-tripController',      label: 'Calls' },
      { id: 'l3-a2',  from: 'l3-driverApp',            to: 'l3-tripController',      label: 'Calls' },
      { id: 'l3-a3',  from: 'l3-tripController',       to: 'l3-tripService',         label: 'Uses' },
      { id: 'l3-a4',  from: 'l3-tripService',          to: 'l3-matchingService',     label: 'Uses' },
      { id: 'l3-a5',  from: 'l3-tripService',          to: 'l3-paymentService',      label: 'Uses' },
      { id: 'l3-a6',  from: 'l3-tripService',          to: 'l3-notificationService', label: 'Uses' },
      { id: 'l3-a7',  from: 'l3-tripService',          to: 'l3-tripRepository',      label: 'Uses' },
      { id: 'l3-a8',  from: 'l3-matchingService',      to: 'l3-cache',               label: 'Reads driver locations from' },
      { id: 'l3-a9',  from: 'l3-tripRepository',       to: 'l3-db',                  label: 'Reads/writes' },
      { id: 'l3-a10', from: 'l3-paymentService',       to: 'l3-payment',             label: 'Charges via' },
      { id: 'l3-a11', from: 'l3-notificationService',  to: 'l3-sms',                 label: 'Sends via' },
    ],
  ),
];

