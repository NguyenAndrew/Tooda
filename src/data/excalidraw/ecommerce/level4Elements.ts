import { makeBox, makeArrow } from '../elementHelpers';

export const ecommerceLevel4Elements = [
  ...makeBox('l4-ctrl', 40, 80, 220, 120,
    'OrderController\n─────────────────\n+createOrder(req, res) void\n+getOrder(req, res) void\n+listOrders(req, res) void', '#bfdbfe'),
  ...makeBox('l4-svc', 300, 80, 220, 140,
    'OrderService\n─────────────────\n-orderRepository: OrderRepository\n-paymentClient: PaymentClient\n-eventPublisher: EventPublisher\n+createOrder(customerId: string, items: OrderItem[]) Promise~Order~\n+getOrder(orderId: string) Promise~Order~', '#bbf7d0'),
  ...makeBox('l4-repo', 560, 80, 220, 120,
    'OrderRepository\n─────────────────\n-db: DatabaseConnection\n+save(order: Order) Promise~Order~\n+findById(orderId: string) Promise~Order~\n+findByCustomer(customerId: string) Promise~Order[]~', '#fde68a'),
  ...makeBox('l4-payment', 40, 280, 220, 100,
    'PaymentClient\n─────────────────\n-apiKey: string\n+charge(amount: number, token: string) Promise~PaymentResult~', '#f3e8ff'),
  ...makeBox('l4-order', 300, 280, 220, 100,
    'Order\n─────────────────\n+id: string\n+customerId: string\n+status: string\n+total: number\n+createdAt: Date', '#fce7f3'),
  ...makeBox('l4-item', 560, 280, 220, 100,
    'OrderItem\n─────────────────\n+productId: string\n+quantity: number\n+unitPrice: number', '#bfdbfe'),
  // Arrows
  ...makeArrow('l4-a1', 'l4-ctrl', 'l4-svc', 260, 140, 40, 0, 'uses'),
  ...makeArrow('l4-a2', 'l4-svc', 'l4-repo', 520, 140, 40, 0, 'uses'),
  ...makeArrow('l4-a3', 'l4-svc', 'l4-payment', 410, 140, -260, 200, 'uses'),
  ...makeArrow('l4-a4', 'l4-repo', 'l4-order', 670, 140, -260, 200, 'returns'),
  ...makeArrow('l4-a5', 'l4-order', 'l4-item', 410, 330, 260, 0, 'contains'),
];
