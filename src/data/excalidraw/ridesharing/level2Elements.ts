import { makeTitle, computeLayout } from '../elementHelpers';

export const ridesharingLevel2Elements = [
  makeTitle('title', 'Container – Ride-Sharing App', 760),
  ...computeLayout(
    [
      { id: 'l2-rider',           label: 'Rider',                  color: '#bfdbfe' },
      { id: 'l2-driver',          label: 'Driver',                 color: '#bfdbfe' },
      { id: 'l2-riderApp',        label: 'Rider App',              color: '#ddd6fe' },
      { id: 'l2-driverApp',       label: 'Driver App',             color: '#ddd6fe' },
      { id: 'l2-apiServer',       label: 'API Server',             color: '#ddd6fe' },
      { id: 'l2-locationService', label: 'Location Service',       color: '#ddd6fe' },
      { id: 'l2-db',              label: 'Database',               color: '#fde68a' },
      { id: 'l2-cache',           label: 'Cache',                  color: '#fde68a' },
      { id: 'l2-maps',            label: 'Maps & Routing API',     color: '#f1f5f9' },
      { id: 'l2-payment',         label: 'Payment Gateway',        color: '#f1f5f9' },
      { id: 'l2-sms',             label: 'SMS Provider',           color: '#f1f5f9' },
    ],
    [
      { id: 'l2-a1',  from: 'l2-rider',           to: 'l2-riderApp',        label: 'Uses' },
      { id: 'l2-a2',  from: 'l2-driver',           to: 'l2-driverApp',       label: 'Uses' },
      { id: 'l2-a3',  from: 'l2-riderApp',         to: 'l2-apiServer',       label: 'Calls' },
      { id: 'l2-a4',  from: 'l2-driverApp',        to: 'l2-apiServer',       label: 'Calls' },
      { id: 'l2-a5',  from: 'l2-driverApp',        to: 'l2-locationService', label: 'Sends location updates to' },
      { id: 'l2-a6',  from: 'l2-apiServer',        to: 'l2-db',              label: 'Reads/writes' },
      { id: 'l2-a7',  from: 'l2-apiServer',        to: 'l2-cache',           label: 'Reads/writes' },
      { id: 'l2-a8',  from: 'l2-locationService',  to: 'l2-cache',           label: 'Updates driver positions in' },
      { id: 'l2-a9',  from: 'l2-apiServer',        to: 'l2-maps',            label: 'Gets routes from' },
      { id: 'l2-a10', from: 'l2-apiServer',        to: 'l2-payment',         label: 'Processes fares via' },
      { id: 'l2-a11', from: 'l2-apiServer',        to: 'l2-sms',             label: 'Sends notifications via' },
    ],
  ),
];

