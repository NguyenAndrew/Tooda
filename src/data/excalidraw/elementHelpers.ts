/** Shared helpers for building typed Excalidraw element arrays. */

export function makeBox(id: string, x: number, y: number, w: number, h: number, text: string, bg: string) {
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

export function makeArrow(id: string, fromId: string, toId: string, x: number, y: number, dx: number, dy: number, label?: string) {
  return [
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
    ...(label ? [{
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
    }] : []),
  ];
}

export function makeTitle(id: string, text: string, w: number) {
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

// ── Sugiyama layout ───────────────────────────────────────────────────────────

export interface LayoutNode {
  id: string;
  label: string;
  color: string;
  /** Box width  (default 200). */
  width?: number;
  /** Box height (default 60). */
  height?: number;
}

export interface LayoutEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

/**
 * Compute a Sugiyama-style (layered, top-to-bottom) layout for a directed
 * graph and return the corresponding Excalidraw elements.
 *
 * Algorithm:
 *  1. **Layer assignment** – longest-path from sources, so every edge points
 *     strictly downward (no back-edges produce crossed layers).
 *  2. **Crossing minimisation** – two-pass barycentric heuristic: top-down
 *     orders each layer by the mean column-index of its predecessors; bottom-up
 *     does the same using successors.  This is the standard O(|E|) heuristic
 *     used by every major Sugiyama implementation.
 *  3. **Coordinate assignment** – fixed H_STEP × V_GAP grid; the y-position
 *     of each layer is advanced by the tallest box in that layer so that
 *     variable-height level-4 class boxes fit without overlap.
 *
 * @param nodes  Node descriptors (id, label, colour, optional w/h).
 * @param edges  Directed edge descriptors (id, from, to, optional label).
 * @param opts   Layout tuning: `hStep` (default 240), `vGap` (default 100),
 *               `startX` (default 40), `startY` (default 100).
 */
export function computeLayout(
  nodes: LayoutNode[],
  edges: LayoutEdge[],
  opts: { hStep?: number; vGap?: number; startX?: number; startY?: number } = {},
): object[] {
  const H_STEP  = opts.hStep  ?? 240;
  const V_GAP   = opts.vGap   ?? 100;
  const START_X = opts.startX ?? 40;
  const START_Y = opts.startY ?? 100;
  const DEFAULT_W = 200;
  const DEFAULT_H = 60;

  // ── Build adjacency ───────────────────────────────────────────────────────
  const out: Record<string, string[]> = {};
  const inc: Record<string, string[]> = {};
  for (const n of nodes) { out[n.id] = []; inc[n.id] = []; }
  for (const e of edges) { out[e.from].push(e.to); inc[e.to].push(e.from); }

  // ── 1. Layer assignment: longest-path from sources ────────────────────────
  const lay: Record<string, number> = {};
  const bfsQ: string[] = [];
  for (const n of nodes) {
    if (inc[n.id].length === 0) { lay[n.id] = 0; bfsQ.push(n.id); }
  }
  let qi = 0;
  while (qi < bfsQ.length) {
    const id = bfsQ[qi++];
    for (const nxt of out[id]) {
      const l = (lay[id] ?? 0) + 1;
      if (lay[nxt] === undefined || lay[nxt] < l) { lay[nxt] = l; bfsQ.push(nxt); }
    }
  }

  // Group nodes by layer
  const byLayer: string[][] = [];
  for (const n of nodes) {
    const l = lay[n.id] ?? 0;
    while (byLayer.length <= l) byLayer.push([]);
    byLayer[l].push(n.id);
  }

  // ── 2. Crossing minimisation: two-pass barycentric heuristic ──────────────
  const pos: Record<string, number> = {};
  for (const row of byLayer) row.forEach((id, i) => { pos[id] = i; });

  const baryCenter = (id: string, nbrs: string[]): number =>
    nbrs.length === 0 ? pos[id] : nbrs.reduce((s, n) => s + pos[n], 0) / nbrs.length;

  // Top-down: order each layer by barycentre of its predecessors
  for (let l = 1; l < byLayer.length; l++) {
    byLayer[l].sort((a, b) => baryCenter(a, inc[a]) - baryCenter(b, inc[b]));
    byLayer[l].forEach((id, i) => { pos[id] = i; });
  }
  // Bottom-up: refine by barycentre of successors
  for (let l = byLayer.length - 2; l >= 0; l--) {
    byLayer[l].sort((a, b) => baryCenter(a, out[a]) - baryCenter(b, out[b]));
    byLayer[l].forEach((id, i) => { pos[id] = i; });
  }

  // ── 3. Coordinate assignment ───────────────────────────────────────────────
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  // Compute the top-y of every layer, advancing by the tallest box + V_GAP
  const layerY: number[] = [];
  let curY = START_Y;
  for (const row of byLayer) {
    layerY.push(curY);
    const maxH = Math.max(...row.map(id => nodeMap[id].height ?? DEFAULT_H));
    curY += maxH + V_GAP;
  }

  // Compute box origins and centres
  const bx: Record<string, number> = {};
  const by_: Record<string, number> = {};
  const cx: Record<string, number> = {};
  const cy: Record<string, number> = {};
  for (let l = 0; l < byLayer.length; l++) {
    for (const id of byLayer[l]) {
      const w = nodeMap[id].width  ?? DEFAULT_W;
      const h = nodeMap[id].height ?? DEFAULT_H;
      const x = START_X + pos[id] * H_STEP;
      const y = layerY[l];
      bx[id] = x; by_[id] = y;
      cx[id] = x + w / 2;
      cy[id] = y + h / 2;
    }
  }

  // ── Generate Excalidraw elements ──────────────────────────────────────────
  const elements: object[] = [];
  for (const n of nodes) {
    elements.push(...makeBox(n.id, bx[n.id], by_[n.id], n.width ?? DEFAULT_W, n.height ?? DEFAULT_H, n.label, n.color));
  }
  for (const e of edges) {
    elements.push(...makeArrow(e.id, e.from, e.to, cx[e.from], cy[e.from], cx[e.to] - cx[e.from], cy[e.to] - cy[e.from], e.label));
  }
  return elements;
}

