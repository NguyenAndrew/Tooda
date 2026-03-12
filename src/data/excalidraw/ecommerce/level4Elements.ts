import { computeLayout } from '../elementHelpers';

export const ecommerceLevel4Elements = [
  ...computeLayout(
    [
      { id: 'l4-ctrl',     label: 'OrderController\n─────────────────\n+createOrder(req, res) void\n+getOrder(req, res) void\n+listOrders(req, res) void',                                                                                                                              color: '#bfdbfe', width: 220, height: 120 },
      { id: 'l4-svc',     label: 'OrderService\n─────────────────\n-orderRepository: OrderRepository\n-paymentClient: PaymentClient\n-eventPublisher: EventPublisher\n+createOrder(customerId: string, items: OrderItem[]) Promise~Order~\n+getOrder(orderId: string) Promise~Order~',  color: '#bbf7d0', width: 220, height: 140 },
      { id: 'l4-repo',    label: 'OrderRepository\n─────────────────\n-db: DatabaseConnection\n+save(order: Order) Promise~Order~\n+findById(orderId: string) Promise~Order~\n+findByCustomer(customerId: string) Promise~Order[]~',                                                    color: '#fde68a', width: 220, height: 120 },
      { id: 'l4-payment', label: 'PaymentClient\n─────────────────\n-apiKey: string\n+charge(amount: number, token: string) Promise~PaymentResult~',                                                                                                                                    color: '#f3e8ff', width: 220, height: 100 },
      { id: 'l4-order',   label: 'Order\n─────────────────\n+id: string\n+customerId: string\n+status: string\n+total: number\n+createdAt: Date',                                                                                                                                       color: '#fce7f3', width: 220, height: 100 },
      { id: 'l4-item',    label: 'OrderItem\n─────────────────\n+productId: string\n+quantity: number\n+unitPrice: number',                                                                                                                                                             color: '#bfdbfe', width: 220, height: 100 },
    ],
    [
      { id: 'l4-a1', from: 'l4-ctrl', to: 'l4-svc',     label: 'uses' },
      { id: 'l4-a2', from: 'l4-svc',  to: 'l4-repo',    label: 'uses' },
      { id: 'l4-a3', from: 'l4-svc',  to: 'l4-payment', label: 'uses' },
      { id: 'l4-a4', from: 'l4-repo', to: 'l4-order',   label: 'returns' },
      { id: 'l4-a5', from: 'l4-order', to: 'l4-item',   label: 'contains' },
    ],
    { hStep: 260, vGap: 60 },
  ),
];

