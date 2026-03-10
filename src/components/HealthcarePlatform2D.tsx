import { useState } from 'react';
import type { Connection } from '../utils/excalidrawToMermaid';
import { LEVEL_NODES } from '../data/healthcare/nodes';

/** Box dimensions (SVG units). */
const BOX_W = 140;
const BOX_H = 56;

/** Centre-to-centre spacing: horizontal between nodes in the same layer,
 *  vertical between layers. */
const H_STEP = 180;
const V_STEP = 130;

/** Padding from SVG edge to the outermost node centre. */
const PAD_X = 80;
const PAD_Y = 70;

interface Props {
  level: 1 | 2 | 3 | 4;
  /** Directed connections derived from Excalidraw arrow bindings. */
  connections: Connection[];
}

/**
 * Custom 2-D SVG diagram for the Healthcare Platform.
 *
 * Nodes are positioned using a Sugiyama-style layered layout:
 *   1. Longest-path layering assigns every node to a layer (top-to-bottom
 *      topological depth).
 *   2. A barycenter heuristic reorders nodes within each layer so that
 *      inter-layer edges cross as rarely as possible.
 *   3. Arrows that span exactly one layer are drawn as straight lines
 *      clipped to box edges — they never pass through an intermediate box
 *      because adjacent-layer boxes occupy different y-bands.
 *   4. Long edges (spanning two or more layers) are routed orthogonally
 *      through the inter-layer lanes so they bypass every intermediate box.
 *
 * The arrow bindings are taken directly from the Excalidraw elements via the
 * `connections` prop, keeping Excalidraw as the single source of truth for
 * which boxes are connected.
 */
export default function HealthcarePlatform2D({ level, connections }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const nodes = LEVEL_NODES[level];

  // Map Excalidraw element ID → node index for O(1) lookups.
  const idToIndex = new Map<string, number>(
    nodes.map((n, i) => [n.excalidrawId, i]),
  );

  // Resolve Excalidraw connections to [fromIndex, toIndex] pairs.
  const connectionPairs: [number, number][] = connections.flatMap(({ from, to }) => {
    const fi = idToIndex.get(from);
    const ti = idToIndex.get(to);
    return fi !== undefined && ti !== undefined ? [[fi, ti] as [number, number]] : [];
  });

  // ── Build adjacency lists ────────────────────────────────────────────────────

  const outEdges: number[][] = nodes.map(() => []);
  const inEdges: number[][] = nodes.map(() => []);
  for (const [fi, ti] of connectionPairs) {
    outEdges[fi].push(ti);
    inEdges[ti].push(fi);
  }

  // ── Longest-path layering ────────────────────────────────────────────────────
  // Each node's layer equals the length of the longest path from any source
  // node to it.  This guarantees every edge goes strictly forward (down).

  const nodeLayers = new Array<number>(nodes.length).fill(0);

  // Topological order via Kahn's algorithm.
  const inDegree = nodes.map((_, i) => inEdges[i].length);
  const topoQueue: number[] = [];
  for (let i = 0; i < nodes.length; i++) {
    if (inDegree[i] === 0) topoQueue.push(i);
  }
  const topoOrder: number[] = [];
  const tempDeg = [...inDegree];
  let qi = 0;
  while (qi < topoQueue.length) {
    const node = topoQueue[qi++];
    topoOrder.push(node);
    for (const next of outEdges[node]) {
      if (--tempDeg[next] === 0) topoQueue.push(next);
    }
  }

  // Propagate layer depths.
  for (const node of topoOrder) {
    for (const next of outEdges[node]) {
      nodeLayers[next] = Math.max(nodeLayers[next], nodeLayers[node] + 1);
    }
  }

  const numLayers = Math.max(...nodeLayers, 0) + 1;

  // ── Barycenter ordering within layers ────────────────────────────────────────
  // Group nodes by layer in their natural (index) order, then sort each layer
  // by the average position of predecessors in the layer above.  This
  // minimises the number of edge crossings between adjacent layers.

  const layerNodes: number[][] = Array.from({ length: numLayers }, () => []);
  for (let i = 0; i < nodes.length; i++) {
    layerNodes[nodeLayers[i]].push(i);
  }

  for (let l = 1; l < numLayers; l++) {
    const layer = layerNodes[l];
    // Compute barycenters before sorting so indexOf calls use the current order.
    const barycenters = new Map<number, number>();
    for (const node of layer) {
      const preds = inEdges[node].filter(p => nodeLayers[p] === l - 1);
      if (preds.length === 0) {
        barycenters.set(node, Infinity);
      } else {
        const avg =
          preds.reduce((s, p) => s + layerNodes[l - 1].indexOf(p), 0) /
          preds.length;
        barycenters.set(node, avg);
      }
    }
    layer.sort((a, b) => barycenters.get(a)! - barycenters.get(b)!);
  }

  // ── Position computation ─────────────────────────────────────────────────────
  // Layers are stacked top-to-bottom; nodes within a layer are spread
  // left-to-right and centred relative to the widest layer.

  const maxNodesInLayer = Math.max(...layerNodes.map(l => l.length), 1);
  const svgW = PAD_X * 2 + (maxNodesInLayer - 1) * H_STEP;
  const svgH = PAD_Y * 2 + (numLayers - 1) * V_STEP;

  const positions: { cx: number; cy: number }[] = new Array(nodes.length);
  for (let l = 0; l < numLayers; l++) {
    const layerSize = layerNodes[l].length;
    const layerWidth = (layerSize - 1) * H_STEP;
    const totalWidth = (maxNodesInLayer - 1) * H_STEP;
    const xOffset = (totalWidth - layerWidth) / 2; // centre this layer
    for (let pos = 0; pos < layerSize; pos++) {
      const nodeIdx = layerNodes[l][pos];
      positions[nodeIdx] = {
        cx: PAD_X + xOffset + pos * H_STEP,
        cy: PAD_Y + l * V_STEP,
      };
    }
  }

  // ── Arrow routing ────────────────────────────────────────────────────────────

  /**
   * Return the point on the box boundary at (cx, cy) where a ray from
   * (cx, cy) toward (tx, ty) first exits the box.
   */
  function clipToBox(cx: number, cy: number, tx: number, ty: number) {
    const dx = tx - cx;
    const dy = ty - cy;
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return { x: cx, y: cy };
    const hw = BOX_W / 2;
    const hh = BOX_H / 2;
    const ts: number[] = [];
    if (dx > 0) ts.push(hw / dx);
    if (dx < 0) ts.push(-hw / dx);
    if (dy > 0) ts.push(hh / dy);
    if (dy < 0) ts.push(-hh / dy);
    const t = Math.min(...ts);
    return { x: cx + t * dx, y: cy + t * dy };
  }

  /**
   * Build the SVG path `d` attribute for a single connection.
   *
   * • 1-layer span: straight line clipped to both box edges.  Adjacent-layer
   *   boxes live in separate horizontal bands so the segment never crosses an
   *   intermediate box.
   * • 2+-layer span (long edge): an orthogonal detour routed through the
   *   inter-layer lanes avoids every intermediate box.
   */
  function routeArrow(fi: number, ti: number): string {
    const fp = positions[fi];
    const tp = positions[ti];
    const fl = nodeLayers[fi];
    const tl = nodeLayers[ti];

    if (tl - fl === 1) {
      // ── Adjacent-layer: straight clipped line ─────────────────────────────
      const start = clipToBox(fp.cx, fp.cy, tp.cx, tp.cy);
      const end   = clipToBox(tp.cx, tp.cy, fp.cx, fp.cy);
      return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    }

    // ── Long edge: orthogonal detour ─────────────────────────────────────────
    // Find the rightmost right-edge of every box in the intermediate layers.
    let maxIntRight = fp.cx + BOX_W / 2;
    for (let l = fl + 1; l < tl; l++) {
      for (const n of layerNodes[l]) {
        maxIntRight = Math.max(maxIntRight, positions[n].cx + BOX_W / 2);
      }
    }
    // The detour lane sits just to the right of all intermediate boxes,
    // but must stay within the SVG canvas.
    const detourX = Math.min(maxIntRight + H_STEP / 4, svgW - PAD_X / 2);

    // Horizontal lanes sit midway between adjacent layers.
    const topLaneY    = fp.cy + V_STEP / 2; // below source layer
    const bottomLaneY = tp.cy - V_STEP / 2; // above target layer

    const startY = fp.cy + BOX_H / 2; // exit source from bottom
    const endY   = tp.cy - BOX_H / 2; // enter target from top

    // Path: down from source → right to detour lane → down to target band
    //       → left to target x → into target.
    return (
      `M ${fp.cx} ${startY} ` +
      `L ${fp.cx} ${topLaneY} ` +
      `L ${detourX} ${topLaneY} ` +
      `L ${detourX} ${bottomLaneY} ` +
      `L ${tp.cx} ${bottomLaneY} ` +
      `L ${tp.cx} ${endY}`
    );
  }

  const MARKER_ID = `arrow2d-l${level}`;

  return (
    <div className="relative w-full" style={{ minHeight: '200px' }}>
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        data-testid={`two-d-diagram-level${level}`}
      >
        <defs>
          <marker
            id={MARKER_ID}
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
          </marker>
        </defs>

        {/* Background */}
        <rect width={svgW} height={svgH} fill="#1e293b" rx="12" />

        {/* Arrows — drawn before boxes so boxes render on top */}
        {connectionPairs.map(([fi, ti], ci) => (
          <path
            key={ci}
            d={routeArrow(fi, ti)}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeOpacity="0.7"
            markerEnd={`url(#${MARKER_ID})`}
          />
        ))}

        {/* Boxes */}
        {nodes.map((node, i) => {
          const { cx, cy } = positions[i];
          const bx = cx - BOX_W / 2;
          const by = cy - BOX_H / 2;
          const isHovered = hoveredIdx === i;
          const color = `#${node.color.toString(16).padStart(6, '0')}`;
          return (
            <g
              key={node.excalidrawId}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: 'default' }}
            >
              <rect
                x={bx}
                y={by}
                width={BOX_W}
                height={BOX_H}
                rx={8}
                ry={8}
                fill={color}
                fillOpacity={isHovered ? 1.0 : 0.85}
                stroke={isHovered ? '#e2e8f0' : 'rgba(255,255,255,0.25)'}
                strokeWidth={isHovered ? 2 : 1}
              />
              <text
                x={cx}
                y={cy - 9}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="15"
              >
                {node.icon}
              </text>
              <text
                x={cx}
                y={cy + 13}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fill="#e2e8f0"
                fontWeight="600"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip */}
      {hoveredIdx !== null && (
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            background: 'rgba(15,23,42,0.92)',
            border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: '0.75rem',
            padding: '10px 14px',
            maxWidth: '220px',
            backdropFilter: 'blur(8px)',
            lineHeight: 1.4,
            textAlign: 'center',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: '1.4rem' }}>{nodes[hoveredIdx].icon}</span>
          <strong style={{ display: 'block', marginTop: '4px', color: '#e2e8f0' }}>
            {nodes[hoveredIdx].label}
          </strong>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {nodes[hoveredIdx].description}
          </span>
        </div>
      )}
    </div>
  );
}
