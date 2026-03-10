import { makeBox, makeArrow, makeTitle } from '../elementHelpers';

export const ecommerceLevel3Elements = [
  makeTitle('title', 'Component – Order Service', 760),
  ...makeBox('l3-apiGateway', 40, 100, 200, 60, 'API Gateway', '#f1f5f9'),
  ...makeBox('l3-queue', 40, 200, 200, 60, 'Message Queue', '#f1f5f9'),
  ...makeBox('l3-db', 40, 300, 200, 60, 'Database', '#fef3c7'),
  ...makeBox('l3-orderController', 280, 100, 200, 60, 'Order Controller', '#e0f2fe'),
  ...makeBox('l3-orderService', 280, 200, 200, 60, 'Order Service', '#e0f2fe'),
  ...makeBox('l3-paymentClient', 520, 100, 200, 60, 'Payment Client', '#e0f2fe'),
  ...makeBox('l3-shippingClient', 520, 200, 200, 60, 'Shipping Client', '#e0f2fe'),
  ...makeBox('l3-orderRepository', 520, 300, 200, 60, 'Order Repository', '#e0f2fe'),
  ...makeBox('l3-eventPublisher', 280, 300, 200, 60, 'Event Publisher', '#e0f2fe'),
  // Arrows
  ...makeArrow('l3-a1', 'l3-apiGateway', 'l3-orderController', 140, 130, 140, 0, 'Calls'),
  ...makeArrow('l3-a2', 'l3-orderController', 'l3-orderService', 380, 130, 0, 100, 'Uses'),
  ...makeArrow('l3-a3', 'l3-orderService', 'l3-paymentClient', 380, 230, 140, -100, 'Uses'),
  ...makeArrow('l3-a4', 'l3-orderService', 'l3-shippingClient', 380, 230, 140, 0, 'Uses'),
  ...makeArrow('l3-a5', 'l3-orderService', 'l3-orderRepository', 380, 230, 140, 100, 'Uses'),
  ...makeArrow('l3-a6', 'l3-orderService', 'l3-eventPublisher', 380, 230, 0, 100, 'Uses'),
  ...makeArrow('l3-a7', 'l3-orderRepository', 'l3-db', 620, 330, -580, 0, 'Reads/writes'),
  ...makeArrow('l3-a8', 'l3-eventPublisher', 'l3-queue', 380, 330, -340, -100, 'Publishes to'),
];
