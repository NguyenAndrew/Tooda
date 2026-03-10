export interface NodeDef { id: string; label: string; }
export interface ConnectionDef { from: string; to: string; }

export function buildC4Elements(prefix: string, nodes: NodeDef[], connections: ConnectionDef[]): any[] {
  const PAD_X = 100, PAD_Y = 80, H_STEP = 200, V_STEP = 120, BOX_W = 160, BOX_H = 64;

  // 1. Topological sort + longest-path layering
  const nodeCount = nodes.length;
  const idToIdx = new Map<string, number>(nodes.map((n, i) => [n.id, i]));
  const inEdges: number[][] = Array.from({ length: nodeCount }, () => []);
  const outEdges: number[][] = Array.from({ length: nodeCount }, () => []);
  connections.forEach(c => {
    const from = idToIdx.get(c.from), to = idToIdx.get(c.to);
    if (from !== undefined && to !== undefined) {
      outEdges[from].push(to);
      inEdges[to].push(from);
    }
  });

  // Kahn's algorithm for topological sort
  const inDeg = inEdges.map(e => e.length);
  const queue: number[] = [];
  inDeg.forEach((d, i) => { if (d === 0) queue.push(i); });
  const topoOrder: number[] = [];
  while (queue.length) {
    const n = queue.shift()!;
    topoOrder.push(n);
    outEdges[n].forEach(to => { if (--inDeg[to] === 0) queue.push(to); });
  }
  // Handle cycles: add remaining nodes
  for (let i = 0; i < nodeCount; i++) {
    if (!topoOrder.includes(i)) topoOrder.push(i);
  }

  // Longest-path layering
  const layer = new Array(nodeCount).fill(0);
  topoOrder.forEach(n => {
    outEdges[n].forEach(to => {
      if (layer[to] < layer[n] + 1) layer[to] = layer[n] + 1;
    });
  });

  // 2. Group nodes by layer
  const maxLayer = Math.max(...layer, 0);
  const layerGroups: number[][] = Array.from({ length: maxLayer + 1 }, () => []);
  nodes.forEach((_, i) => layerGroups[layer[i]].push(i));

  // 3. Barycenter heuristic for ordering within each layer
  for (let l = 1; l <= maxLayer; l++) {
    layerGroups[l].sort((a, b) => {
      const bcA = inEdges[a].length === 0 ? 0 : inEdges[a].reduce((s, p) => s + layerGroups[layer[p]].indexOf(p), 0) / inEdges[a].length;
      const bcB = inEdges[b].length === 0 ? 0 : inEdges[b].reduce((s, p) => s + layerGroups[layer[p]].indexOf(p), 0) / inEdges[b].length;
      return bcA - bcB;
    });
  }

  // 4. Compute x,y positions
  const pos = new Array(nodeCount).fill(null).map(() => ({ x: 0, y: 0 }));
  layerGroups.forEach((group, l) => {
    group.forEach((ni, pos_i) => {
      pos[ni] = {
        x: PAD_X + pos_i * H_STEP,
        y: PAD_Y + l * V_STEP,
      };
    });
  });

  // 5. Build arrow IDs per node
  const nodeArrowIds: Map<number, string[]> = new Map(nodes.map((_, i) => [i, []]));
  connections.forEach((c, ci) => {
    const arrowId = `${prefix}-a${ci + 1}`;
    const fromIdx = idToIdx.get(c.from);
    const toIdx = idToIdx.get(c.to);
    if (fromIdx !== undefined) nodeArrowIds.get(fromIdx)!.push(arrowId);
    if (toIdx !== undefined) nodeArrowIds.get(toIdx)!.push(arrowId);
  });

  // 6. Generate Excalidraw elements
  const elements: any[] = [];

  // Rectangle + text label for each node
  nodes.forEach((node, i) => {
    const { x, y } = pos[i];
    const arrowIds = nodeArrowIds.get(i)!.map(id => ({ type: 'arrow', id }));
    const boundElements = [{ type: 'text', id: node.id + '-label' }, ...arrowIds];

    elements.push({
      type: 'rectangle',
      id: node.id,
      x, y,
      width: BOX_W, height: BOX_H,
      strokeColor: '#1e1e1e',
      backgroundColor: '#bfdbfe',
      fillStyle: 'solid',
      strokeWidth: 2,
      strokeStyle: 'solid',
      roughness: 1,
      opacity: 100,
      roundness: { type: 3 },
      groupIds: [],
      frameId: null,
      angle: 0,
      isDeleted: false,
      locked: false,
      link: null,
      boundElements,
      seed: i * 17 + 1,
      version: 1,
      versionNonce: i * 2,
      updated: 1,
      index: 'a' + i,
    });

    elements.push({
      type: 'text',
      id: node.id + '-label',
      x, y,
      width: BOX_W, height: BOX_H,
      text: node.label,
      fontSize: 14,
      fontFamily: 1,
      textAlign: 'center',
      verticalAlign: 'middle',
      containerId: node.id,
      lineHeight: 1.25,
      autoResize: true,
      strokeColor: '#1e1e1e',
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: 1,
      strokeStyle: 'solid',
      roughness: 1,
      opacity: 100,
      roundness: null,
      groupIds: [],
      frameId: null,
      angle: 0,
      isDeleted: false,
      locked: false,
      link: null,
      boundElements: null,
      seed: i * 17 + 100,
      version: 1,
      versionNonce: i * 2 + 1,
      updated: 1,
    });
  });

  // Arrow for each connection
  connections.forEach((c, ci) => {
    const fromIdx = idToIdx.get(c.from);
    const toIdx = idToIdx.get(c.to);
    if (fromIdx === undefined || toIdx === undefined) return;
    const fromPos = pos[fromIdx];
    const toPos = pos[toIdx];
    const dx = (toPos.x + BOX_W / 2) - (fromPos.x + BOX_W / 2);
    const dy = (toPos.y + BOX_H / 2) - (fromPos.y + BOX_H / 2);
    const arrowId = `${prefix}-a${ci + 1}`;

    elements.push({
      type: 'arrow',
      id: arrowId,
      x: fromPos.x + BOX_W / 2,
      y: fromPos.y + BOX_H / 2,
      width: Math.abs(dx),
      height: Math.abs(dy),
      points: [[0, 0], [dx, dy]],
      startBinding: { elementId: c.from, focus: 0, gap: 8 },
      endBinding: { elementId: c.to, focus: 0, gap: 8 },
      strokeColor: '#1e1e1e',
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: 2,
      strokeStyle: 'solid',
      roughness: 1,
      opacity: 100,
      roundness: { type: 2 },
      groupIds: [],
      frameId: null,
      angle: 0,
      isDeleted: false,
      locked: false,
      link: null,
      boundElements: null,
      lastCommittedPoint: null,
      startArrowhead: null,
      endArrowhead: 'arrow',
      elbowed: false,
      seed: ci * 7 + 3,
      version: 1,
      versionNonce: ci * 2,
      updated: 1,
    });
  });

  return elements;
}
