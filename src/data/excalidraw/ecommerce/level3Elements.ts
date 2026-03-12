import { makeTitle, computeLayout } from '../elementHelpers';

export const ecommerceLevel3Elements = [
  makeTitle('title', 'Component – Order Service', 760),
  ...computeLayout(
    [
      { id: 'l3-apiGateway',       label: 'API Gateway',         color: '#f1f5f9' },
      { id: 'l3-orderController',  label: 'Order Controller',    color: '#e0f2fe' },
      { id: 'l3-orderService',     label: 'Order Service',       color: '#e0f2fe' },
      { id: 'l3-paymentClient',    label: 'Payment Client',      color: '#e0f2fe' },
      { id: 'l3-shippingClient',   label: 'Shipping Client',     color: '#e0f2fe' },
      { id: 'l3-orderRepository',  label: 'Order Repository',    color: '#e0f2fe' },
      { id: 'l3-eventPublisher',   label: 'Event Publisher',     color: '#e0f2fe' },
      { id: 'l3-db',               label: 'Database',            color: '#fef3c7' },
      { id: 'l3-queue',            label: 'Message Queue',       color: '#f1f5f9' },
    ],
    [
      { id: 'l3-a1', from: 'l3-apiGateway',      to: 'l3-orderController',  label: 'Calls' },
      { id: 'l3-a2', from: 'l3-orderController',  to: 'l3-orderService',     label: 'Uses' },
      { id: 'l3-a3', from: 'l3-orderService',     to: 'l3-paymentClient',    label: 'Uses' },
      { id: 'l3-a4', from: 'l3-orderService',     to: 'l3-shippingClient',   label: 'Uses' },
      { id: 'l3-a5', from: 'l3-orderService',     to: 'l3-orderRepository',  label: 'Uses' },
      { id: 'l3-a6', from: 'l3-orderService',     to: 'l3-eventPublisher',   label: 'Uses' },
      { id: 'l3-a7', from: 'l3-orderRepository',  to: 'l3-db',               label: 'Reads/writes' },
      { id: 'l3-a8', from: 'l3-eventPublisher',   to: 'l3-queue',            label: 'Publishes to' },
    ],
  ),
];

