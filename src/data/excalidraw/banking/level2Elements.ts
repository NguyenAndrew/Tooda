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

export const bankingLevel2Elements = [
  makeTitle('title', 'Container – Online Banking System', 760),
  ...makeBox('l2-customer', 40, 100, 200, 60, 'Personal Banking Customer', '#bfdbfe'),
  ...makeBox('l2-email', 40, 260, 200, 60, 'E-mail System', '#f1f5f9'),
  ...makeBox('l2-mainframe', 40, 360, 200, 60, 'Mainframe Banking System', '#f1f5f9'),
  ...makeBox('l2-webApp', 280, 100, 200, 60, 'Web Application', '#ddd6fe'),
  ...makeBox('l2-spa', 280, 200, 200, 60, 'Single-Page App', '#ddd6fe'),
  ...makeBox('l2-mobileApp', 280, 300, 200, 60, 'Mobile App', '#ddd6fe'),
  ...makeBox('l2-apiApp', 520, 200, 200, 60, 'API Application', '#ddd6fe'),
  ...makeBox('l2-db', 520, 300, 200, 60, 'Database', '#fde68a'),
  // Arrows
  ...makeArrow('l2-a1', 'l2-customer', 'l2-webApp', 140, 130, 140, 0, 'Visits'),
  ...makeArrow('l2-a2', 'l2-customer', 'l2-mobileApp', 140, 130, 140, 170, 'Uses'),
  ...makeArrow('l2-a3', 'l2-webApp', 'l2-spa', 380, 130, 0, 70, 'Delivers'),
  ...makeArrow('l2-a4', 'l2-spa', 'l2-apiApp', 380, 230, 140, 0, 'Makes API calls to'),
  ...makeArrow('l2-a5', 'l2-mobileApp', 'l2-apiApp', 380, 330, 140, -100, 'Makes API calls to'),
  ...makeArrow('l2-a6', 'l2-apiApp', 'l2-db', 620, 230, 0, 100, 'Reads/writes'),
  ...makeArrow('l2-a7', 'l2-apiApp', 'l2-email', 620, 230, -580, 60, 'Sends emails using'),
  ...makeArrow('l2-a8', 'l2-apiApp', 'l2-mainframe', 620, 230, -580, 160, 'Reads/writes account data'),
];
