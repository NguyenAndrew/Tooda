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

function makeTitle(id: string, text: string, w: number) {
  return {
    id, type: 'text' as const,
    x: 20, y: 20, width: w, height: 30, angle: 0,
    strokeColor: '#1e1e1e', backgroundColor: 'transparent' as const,
    fillStyle: 'solid' as const, strokeWidth: 1, strokeStyle: 'solid' as const,
    roughness: 1, opacity: 100, groupIds: [], frameId: null, roundness: null,
    seed: 10, version: 1, versionNonce: 1, isDeleted: false, boundElements: null,
    updated: 1, link: null, locked: false,
    text, fontSize: 20, fontFamily: 1 as const,
    textAlign: 'center' as const, verticalAlign: 'middle' as const,
    containerId: null, originalText: text, autoResize: true, lineHeight: 1.25 as const,
  };
}

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
