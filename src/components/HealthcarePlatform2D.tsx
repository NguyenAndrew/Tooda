import { useState } from 'react';
import type { Connection } from '../utils/excalidrawToMermaid';
import { LEVEL_NODES } from '../data/healthcare/nodes';

/** Number of node columns in the grid layout. */
const COLS = 4;

/** Box dimensions (SVG units). */
const BOX_W = 140;
const BOX_H = 56;

/** Center-to-center spacing between boxes. */
const H_STEP = 180;
const V_STEP = 130;

/** Padding from SVG edge to the outermost node centre. */
const PAD_X = 80;
const PAD_Y = 60;

interface Props {
  level: 1 | 2 | 3 | 4;
  /** Directed connections derived from Excalidraw arrow bindings. */
  connections: Connection[];
}

/**
 * Custom 2-D SVG diagram for the Healthcare Platform.
 *
 * Nodes are laid out in a grid; connections are drawn as straight arrows.
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

  // ── Grid layout ─────────────────────────────────────────────────────────────

  const numCols = Math.min(COLS, nodes.length);
  const numRows = Math.ceil(nodes.length / numCols);

  const svgW = PAD_X * 2 + (numCols - 1) * H_STEP;
  const svgH = PAD_Y * 2 + (numRows - 1) * V_STEP;

  const positions = nodes.map((_, i) => {
    const row = Math.floor(i / numCols);
    const col = i % numCols;
    // Centre the last (partial) row horizontally.
    const rowStart = row * numCols;
    const rowCount = Math.min(numCols, nodes.length - rowStart);
    const rowOffset = ((numCols - rowCount) * H_STEP) / 2;
    return {
      cx: PAD_X + col * H_STEP + rowOffset,
      cy: PAD_Y + row * V_STEP,
    };
  });

  // ── Arrow edge clipping ──────────────────────────────────────────────────────

  /**
   * Return the point on the box boundary at (cx, cy) where a ray from (cx, cy)
   * toward (tx, ty) first exits the box.  Used to start/end arrows at box edges
   * rather than centres.
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
        {connectionPairs.map(([fi, ti], ci) => {
          const fp = positions[fi];
          const tp = positions[ti];
          const start = clipToBox(fp.cx, fp.cy, tp.cx, tp.cy);
          const end = clipToBox(tp.cx, tp.cy, fp.cx, fp.cy);
          return (
            <line
              key={ci}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeOpacity="0.7"
              markerEnd={`url(#${MARKER_ID})`}
            />
          );
        })}

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
