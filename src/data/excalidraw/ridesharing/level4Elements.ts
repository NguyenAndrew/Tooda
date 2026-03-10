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

export const ridesharingLevel4Elements = [
  ...makeBox('l4-ctrl', 40, 80, 220, 120,
    'TripController\n─────────────────\n+requestTrip(req, res) void\n+acceptTrip(req, res) void\n+completeTrip(req, res) void', '#bfdbfe'),
  ...makeBox('l4-svc', 300, 80, 220, 140,
    'TripService\n─────────────────\n-matchingService: MatchingService\n-tripRepository: TripRepository\n-paymentService: PaymentService\n+requestTrip(riderId: string, pickup: Location) Promise~Trip~\n+completeTrip(tripId: string) Promise~Trip~', '#bbf7d0'),
  ...makeBox('l4-matching', 560, 80, 220, 100,
    'MatchingService\n─────────────────\n-cache: CacheClient\n+findNearestDriver(pickup: Location) Promise~Driver~', '#fde68a'),
  ...makeBox('l4-repo', 40, 280, 220, 100,
    'TripRepository\n─────────────────\n-db: DatabaseConnection\n+save(trip: Trip) Promise~Trip~\n+findById(tripId: string) Promise~Trip~', '#f3e8ff'),
  ...makeBox('l4-trip', 300, 280, 220, 100,
    'Trip\n─────────────────\n+id: string\n+riderId: string\n+driverId: string\n+status: string\n+fare: number', '#fce7f3'),
  ...makeBox('l4-location', 560, 280, 220, 100,
    'Location\n─────────────────\n+lat: number\n+lng: number', '#bfdbfe'),
  // Arrows
  ...makeArrow('l4-a1', 'l4-ctrl', 'l4-svc', 260, 140, 40, 0, 'uses'),
  ...makeArrow('l4-a2', 'l4-svc', 'l4-matching', 520, 140, 40, 0, 'uses'),
  ...makeArrow('l4-a3', 'l4-svc', 'l4-repo', 410, 140, -260, 200, 'uses'),
  ...makeArrow('l4-a4', 'l4-repo', 'l4-trip', 150, 330, 260, 0, 'returns'),
  ...makeArrow('l4-a5', 'l4-trip', 'l4-location', 410, 330, 260, 0, 'uses'),
];
