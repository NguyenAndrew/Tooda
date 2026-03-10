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

export const ridesharingLevel2Elements = [
  makeTitle('title', 'Container – Ride-Sharing App', 760),
  ...makeBox('l2-rider', 40, 100, 180, 60, 'Rider', '#bfdbfe'),
  ...makeBox('l2-driver', 40, 200, 180, 60, 'Driver', '#bfdbfe'),
  ...makeBox('l2-maps', 40, 320, 180, 60, 'Maps & Routing API', '#f1f5f9'),
  ...makeBox('l2-payment', 40, 420, 180, 60, 'Payment Gateway', '#f1f5f9'),
  ...makeBox('l2-sms', 40, 520, 180, 60, 'SMS Provider', '#f1f5f9'),
  ...makeBox('l2-riderApp', 280, 100, 200, 60, 'Rider App', '#ddd6fe'),
  ...makeBox('l2-driverApp', 280, 200, 200, 60, 'Driver App', '#ddd6fe'),
  ...makeBox('l2-apiServer', 520, 100, 200, 60, 'API Server', '#ddd6fe'),
  ...makeBox('l2-locationService', 520, 200, 200, 60, 'Location Service', '#ddd6fe'),
  ...makeBox('l2-db', 280, 320, 200, 60, 'Database', '#fde68a'),
  ...makeBox('l2-cache', 520, 320, 200, 60, 'Cache', '#fde68a'),
  // Arrows
  ...makeArrow('l2-a1', 'l2-rider', 'l2-riderApp', 130, 130, 150, 0, 'Uses'),
  ...makeArrow('l2-a2', 'l2-driver', 'l2-driverApp', 130, 230, 150, 0, 'Uses'),
  ...makeArrow('l2-a3', 'l2-riderApp', 'l2-apiServer', 380, 130, 140, 0, 'Calls'),
  ...makeArrow('l2-a4', 'l2-driverApp', 'l2-apiServer', 380, 230, 140, -100, 'Calls'),
  ...makeArrow('l2-a5', 'l2-driverApp', 'l2-locationService', 380, 230, 140, 0, 'Sends location updates to'),
  ...makeArrow('l2-a6', 'l2-apiServer', 'l2-db', 620, 130, -240, 220, 'Reads/writes'),
  ...makeArrow('l2-a7', 'l2-apiServer', 'l2-cache', 620, 130, 0, 220, 'Reads/writes'),
  ...makeArrow('l2-a8', 'l2-locationService', 'l2-cache', 620, 230, 0, 120, 'Updates driver positions in'),
  ...makeArrow('l2-a9', 'l2-apiServer', 'l2-maps', 620, 130, -580, 220, 'Gets routes from'),
  ...makeArrow('l2-a10', 'l2-apiServer', 'l2-payment', 620, 130, -580, 320, 'Processes fares via'),
  ...makeArrow('l2-a11', 'l2-apiServer', 'l2-sms', 620, 130, -580, 420, 'Sends notifications via'),
];
