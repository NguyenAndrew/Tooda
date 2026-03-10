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

export const toodaLevel2Elements = [
  makeTitle('title', 'Container – Tooda', 760),
  ...makeBox('l2-developer', 40, 100, 200, 60, 'Developer / Architect', '#bfdbfe'),
  ...makeBox('l2-githubPages', 40, 200, 200, 60, 'GitHub Pages', '#f1f5f9'),
  ...makeBox('l2-mermaidLib', 40, 300, 200, 60, 'Mermaid Library', '#f1f5f9'),
  ...makeBox('l2-excalidrawLib', 40, 400, 200, 60, 'Excalidraw Library', '#f1f5f9'),
  ...makeBox('l2-webApp', 280, 100, 200, 60, 'Static Web App', '#ddd6fe'),
  ...makeBox('l2-c4Page', 280, 200, 200, 60, 'C4 Viewer', '#ddd6fe'),
  ...makeBox('l2-excalidrawPage', 280, 300, 200, 60, 'Excalidraw Viewer', '#ddd6fe'),
  ...makeBox('l2-apiPage', 280, 400, 200, 60, 'API Explorer', '#ddd6fe'),
  // Arrows
  ...makeArrow('l2-a1', 'l2-developer', 'l2-webApp', 140, 130, 140, 0, 'Visits'),
  ...makeArrow('l2-a2', 'l2-githubPages', 'l2-webApp', 140, 230, 140, -100, 'Hosts and serves'),
  ...makeArrow('l2-a3', 'l2-webApp', 'l2-c4Page', 380, 130, 0, 100, 'Routes /c4 to'),
  ...makeArrow('l2-a4', 'l2-webApp', 'l2-excalidrawPage', 380, 130, 0, 200, 'Routes /excalidraw to'),
  ...makeArrow('l2-a5', 'l2-webApp', 'l2-apiPage', 380, 130, 0, 300, 'Routes /api to'),
  ...makeArrow('l2-a6', 'l2-c4Page', 'l2-mermaidLib', 380, 230, -240, 100, 'Renders diagrams with'),
  ...makeArrow('l2-a7', 'l2-excalidrawPage', 'l2-excalidrawLib', 380, 330, -240, 100, 'Renders diagrams with'),
];
