function makeBox(id: string, x: number, y: number, w: number, h: number, text: string, bg: string) {
  return [
    {
      id, type: 'rectangle' as const,
      x, y, width: w, height: h, angle: 0,
      strokeColor: '#1e1e1e', backgroundColor: bg, fillStyle: 'solid' as const,
      strokeWidth: 2, strokeStyle: 'solid' as const, roughness: 1, opacity: 100,
      groupIds: [], frameId: null, roundness: { type: 3 as const },
      seed: 1, version: 1, versionNonce: 1, isDeleted: false,
      boundElements: [{ type: 'text' as const, id: id + '-label' }],
      updated: 1, link: null, locked: false,
    },
    {
      id: id + '-label', type: 'text' as const,
      x, y: y + (h - 20) / 2, width: w, height: 20, angle: 0,
      strokeColor: '#1e1e1e', backgroundColor: 'transparent' as const,
      fillStyle: 'solid' as const, strokeWidth: 1, strokeStyle: 'solid' as const,
      roughness: 1, opacity: 100, groupIds: [], frameId: null, roundness: null,
      seed: 2, version: 1, versionNonce: 1, isDeleted: false, boundElements: null,
      updated: 1, link: null, locked: false,
      text, fontSize: 16, fontFamily: 1 as const,
      textAlign: 'center' as const, verticalAlign: 'middle' as const,
      containerId: id, originalText: text, autoResize: true, lineHeight: 1.25 as const,
    },
  ];
}

function makeArrow(id: string, fromId: string, toId: string, x: number, y: number, dx: number, dy: number, label?: string) {
  const elements: any[] = [
    {
      id, type: 'arrow' as const,
      x, y, width: Math.abs(dx), height: Math.abs(dy), angle: 0,
      strokeColor: '#1e1e1e', backgroundColor: 'transparent' as const,
      fillStyle: 'solid' as const, strokeWidth: 2, strokeStyle: 'solid' as const,
      roughness: 1, opacity: 100, groupIds: [], frameId: null,
      roundness: { type: 2 as const }, seed: 3, version: 1, versionNonce: 1,
      isDeleted: false, boundElements: label ? [{ type: 'text' as const, id: id + '-label' }] : null,
      updated: 1, link: null, locked: false,
      points: [[0, 0], [dx, dy]] as [number, number][],
      lastCommittedPoint: null,
      startBinding: { elementId: fromId, focus: 0, gap: 1 },
      endBinding: { elementId: toId, focus: 0, gap: 1 },
      startArrowhead: null, endArrowhead: 'arrow' as const, elbowed: false,
    },
  ];
  if (label) {
    elements.push({
      id: id + '-label', type: 'text' as const,
      x: x + dx / 2 - 60, y: y + dy / 2 - 12, width: 120, height: 20, angle: 0,
      strokeColor: '#1e1e1e', backgroundColor: '#ffffff' as const,
      fillStyle: 'solid' as const, strokeWidth: 1, strokeStyle: 'solid' as const,
      roughness: 1, opacity: 100, groupIds: [], frameId: null, roundness: null,
      seed: 4, version: 1, versionNonce: 1, isDeleted: false, boundElements: null,
      updated: 1, link: null, locked: false,
      text: label, fontSize: 12, fontFamily: 1 as const,
      textAlign: 'center' as const, verticalAlign: 'middle' as const,
      containerId: id, originalText: label, autoResize: true, lineHeight: 1.25 as const,
    });
  }
  return elements;
}

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
