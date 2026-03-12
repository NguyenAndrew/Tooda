import { makeTitle, computeLayout } from '../elementHelpers';

export const ecommerceLevel2Elements = [
  makeTitle('title', 'Container – E-Commerce Platform', 760),
  ...computeLayout(
    [
      { id: 'l2-customer',       label: 'Customer',            color: '#bfdbfe' },
      { id: 'l2-seller',         label: 'Seller',              color: '#bfdbfe' },
      { id: 'l2-webApp',         label: 'Web Application',     color: '#ddd6fe' },
      { id: 'l2-mobileApp',      label: 'Mobile App',          color: '#ddd6fe' },
      { id: 'l2-apiGateway',     label: 'API Gateway',         color: '#ddd6fe' },
      { id: 'l2-productService', label: 'Product Service',     color: '#ddd6fe' },
      { id: 'l2-orderService',   label: 'Order Service',       color: '#ddd6fe' },
      { id: 'l2-db',             label: 'Database',            color: '#fde68a' },
      { id: 'l2-queue',          label: 'Message Queue',       color: '#ddd6fe' },
      { id: 'l2-payment',        label: 'Payment Gateway',     color: '#f1f5f9' },
      { id: 'l2-shipping',       label: 'Shipping Provider',   color: '#f1f5f9' },
      { id: 'l2-email',          label: 'E-mail System',       color: '#f1f5f9' },
    ],
    [
      { id: 'l2-a1',  from: 'l2-customer',       to: 'l2-webApp',         label: 'Visits' },
      { id: 'l2-a2',  from: 'l2-customer',        to: 'l2-mobileApp',      label: 'Uses' },
      { id: 'l2-a3',  from: 'l2-seller',          to: 'l2-webApp',         label: 'Manages listings via' },
      { id: 'l2-a4',  from: 'l2-webApp',          to: 'l2-apiGateway',     label: 'Calls' },
      { id: 'l2-a5',  from: 'l2-mobileApp',       to: 'l2-apiGateway',     label: 'Calls' },
      { id: 'l2-a6',  from: 'l2-apiGateway',      to: 'l2-productService', label: 'Routes to' },
      { id: 'l2-a7',  from: 'l2-apiGateway',      to: 'l2-orderService',   label: 'Routes to' },
      { id: 'l2-a8',  from: 'l2-productService',  to: 'l2-db',             label: 'Reads/writes' },
      { id: 'l2-a9',  from: 'l2-orderService',    to: 'l2-db',             label: 'Reads/writes' },
      { id: 'l2-a10', from: 'l2-orderService',    to: 'l2-queue',          label: 'Publishes events to' },
      { id: 'l2-a11', from: 'l2-queue',            to: 'l2-payment',        label: 'Triggers payment via' },
      { id: 'l2-a12', from: 'l2-queue',            to: 'l2-shipping',       label: 'Triggers shipment via' },
      { id: 'l2-a13', from: 'l2-queue',            to: 'l2-email',          label: 'Sends notifications via' },
    ],
  ),
];

