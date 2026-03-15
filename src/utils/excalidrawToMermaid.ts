/**
 * excalidrawToMermaid
 *
 * Derives Mermaid diagram text from Excalidraw elements.
 *
 * Excalidraw is the visual source of truth: it encodes every node (as a
 * rectangle), every label (as a text element whose `containerId` points at
 * the parent rectangle or arrow), and every relationship (as an arrow whose
 * `startBinding` / `endBinding` carry the source and target element IDs).
 *
 * The only information the converter cannot extract from the visual alone is
 * the C4 semantic type of each node (Person vs System vs Container, etc.) and
 * the narrative description strings. These are supplied through the `LevelMeta`
 * argument, which acts as a thin semantic annotation layer on top of the
 * Excalidraw data.
 */

// ── Public types ──────────────────────────────────────────────────────────────

export type C4NodeType =
  | 'Person'
  | 'System'
  | 'System_Ext'
  | 'Container'
  | 'ContainerDb'
  | 'Container_Ext'
  | 'ContainerDb_Ext'
  | 'Component';

export interface NodeMeta {
  /** C4 semantic type of the node. */
  c4type: C4NodeType;
  /** Narrative description shown inside the node shape. */
  desc?: string;
  /**
   * Technology / runtime string.  If not set, the converter will try to
   * parse it from the label text (e.g. "Web App\n(Astro)" → "Astro").
   */
  tech?: string;
}

export interface BoundaryMeta {
  /** Variable name used in the Mermaid source (e.g. 'hp'). */
  id: string;
  /** Display label inside the boundary box (e.g. 'Healthcare Platform'). */
  label: string;
  type: 'Enterprise_Boundary' | 'System_Boundary' | 'Container_Boundary';
  /** Excalidraw element IDs of the nodes that sit inside this boundary. */
  nodeIds: string[];
}

export interface LevelMeta {
  diagramType: 'C4Context' | 'C4Container' | 'C4Component' | 'classDiagram' | 'flowchart';
  /** Per-node semantic metadata, keyed by Excalidraw element ID. */
  nodes?: Record<string, NodeMeta>;
  /** Optional boundaries that group nodes visually. */
  boundaries?: BoundaryMeta[];
  /**
   * Optional C4 layout configuration emitted as `UpdateLayoutConfig(...)`.
   * Uses Mermaid's built-in grid algorithm parameters to control how many
   * nodes/boundaries appear per row, preventing arrow-node intersections.
   * Ignored when `useElk` is true.
   */
  layoutConfig?: { c4ShapeInRow?: number; c4BoundaryInRow?: number };
  /**
   * When true, prepends `%%{init: {"layout": "elk"}}%%` to the generated
   * Mermaid string so Mermaid uses its ELK layout engine (a Sugiyama-style
   * layered algorithm) instead of the default C4 grid layout.  This produces
   * cleaner edge routing that avoids intersecting lines and boxes, similar to
   * the 2D SVG Sugiyama layout used by C4Diagram2D.
   */
  useElk?: boolean;
}

// ── Lightweight internal element shape ───────────────────────────────────────

interface RawEl {
  id: string;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  originalText?: string;
  fontSize?: number;
  containerId?: string | null;
  startBinding?: { elementId: string } | null;
  endBinding?: { elementId: string } | null;
  points?: [number, number][];
}

// ── Entry points ─────────────────────────────────────────────────────────────

/** A directed connection extracted from an Excalidraw arrow element. */
export interface Connection {
  /** Excalidraw element ID of the arrow's source box. */
  from: string;
  /** Excalidraw element ID of the arrow's target box. */
  to: string;
}

/** A lint error reported by {@link lintExcalidrawDiagram}. */
export interface DiagramLintError {
  /** Excalidraw element ID of the offending element. */
  elementId: string;
  /** Human-readable description of the problem. */
  message: string;
}

/**
 * Extract the directed connections (arrows) from a set of Excalidraw elements.
 *
 * Only arrow elements that have both a startBinding and an endBinding are
 * included; decorative or unconnected arrows are silently skipped.
 *
 * @param elements  The raw Excalidraw element array (any level file export).
 */
export function extractConnections(elements: readonly unknown[]): Connection[] {
  const els = elements as readonly RawEl[];
  const connections: Connection[] = [];
  for (const el of els) {
    if (
      el.type === 'arrow' &&
      el.startBinding?.elementId &&
      el.endBinding?.elementId
    ) {
      connections.push({ from: el.startBinding.elementId, to: el.endBinding.elementId });
    }
  }
  return connections;
}

/**
 * Return true when two line segments properly intersect (cross in their
 * respective interiors, not merely at a shared endpoint).
 *
 * Uses the standard parametric cross-product formulation: segments
 * (p1→p2) and (p3→p4) intersect when both parameters t and u lie in
 * the open interval (0, 1).
 */
function segmentsProperlyIntersect(
  x1: number, y1: number, x2: number, y2: number,
  x3: number, y3: number, x4: number, y4: number,
): boolean {
  const d1x = x2 - x1, d1y = y2 - y1;
  const d2x = x4 - x3, d2y = y4 - y3;
  const cross = d1x * d2y - d1y * d2x;
  if (Math.abs(cross) < 1e-10) return false; // parallel / collinear
  const t = ((x3 - x1) * d2y - (y3 - y1) * d2x) / cross;
  const u = ((x3 - x1) * d1y - (y3 - y1) * d1x) / cross;
  return t > 0 && t < 1 && u > 0 && u < 1;
}

/**
 * Lint an Excalidraw element array for Sugiyama-style diagram compatibility.
 *
 * Sugiyama-style layout (Mermaid's `flowchart TB` via Dagre) requires every
 * arrow to be bound at both ends so that the layout engine can build a proper
 * directed acyclic graph.  This function reports any arrow element that is
 * missing a `startBinding`, missing an `endBinding`, or whose binding points
 * to an element ID that does not exist in the same element array.
 *
 * It also verifies that arrow endpoints are placed on box boundaries rather
 * than at box centres, and that no two arrows visually intersect (cross in
 * their interiors).  Intersecting arrows indicate a layout ordering problem
 * that should be fixed by reordering the node declarations passed to
 * {@link computeLayout} so the barycentric heuristic can produce a
 * crossing-free assignment.
 *
 * Calling this on every diagram at lint time ensures that no arrow is silently
 * dropped by {@link extractConnections} or {@link excalidrawToMermaid}, and
 * that the visual diagram is free of crossing edges.
 *
 * @param elements  The raw Excalidraw element array (any level file export).
 * @returns         An array of lint errors; empty when the diagram is clean.
 */
export function lintExcalidrawDiagram(elements: readonly unknown[]): DiagramLintError[] {
  const els = elements as readonly RawEl[];
  const knownIds = new Set(els.map((el) => el.id));
  const elMap = new Map<string, RawEl>(els.map((el) => [el.id, el]));
  const errors: DiagramLintError[] = [];
  /** Tolerance for floating-point equality when comparing coordinates. */
  const COORDINATE_TOLERANCE = 0.5;

  for (const el of els) {
    if (el.type !== 'arrow') continue;

    if (!el.startBinding?.elementId) {
      errors.push({ elementId: el.id, message: 'Arrow is missing startBinding' });
    } else if (!knownIds.has(el.startBinding.elementId)) {
      errors.push({
        elementId: el.id,
        message: `Arrow startBinding references unknown element "${el.startBinding.elementId}"`,
      });
    } else {
      // Verify the arrow does not originate from the center of its source box.
      const fromEl = elMap.get(el.startBinding.elementId);
      if (fromEl?.width !== undefined && fromEl?.height !== undefined) {
        const boxCx = fromEl.x + fromEl.width / 2;
        const boxCy = fromEl.y + fromEl.height / 2;
        if (Math.abs(el.x - boxCx) < COORDINATE_TOLERANCE && Math.abs(el.y - boxCy) < COORDINATE_TOLERANCE) {
          errors.push({
            elementId: el.id,
            message: 'Arrow originates from the center of its source box; use box-boundary coordinates',
          });
        }
      }
    }

    if (!el.endBinding?.elementId) {
      errors.push({ elementId: el.id, message: 'Arrow is missing endBinding' });
    } else if (!knownIds.has(el.endBinding.elementId)) {
      errors.push({
        elementId: el.id,
        message: `Arrow endBinding references unknown element "${el.endBinding.elementId}"`,
      });
    } else {
      // Verify the arrow does not terminate at the center of its target box.
      const toEl = elMap.get(el.endBinding.elementId);
      if (toEl?.width !== undefined && toEl?.height !== undefined && el.points?.length) {
        const lastPt = el.points[el.points.length - 1];
        const endX = el.x + lastPt[0];
        const endY = el.y + lastPt[1];
        const boxCx = toEl.x + toEl.width / 2;
        const boxCy = toEl.y + toEl.height / 2;
        if (Math.abs(endX - boxCx) < COORDINATE_TOLERANCE && Math.abs(endY - boxCy) < COORDINATE_TOLERANCE) {
          errors.push({
            elementId: el.id,
            message: 'Arrow terminates at the center of its target box; use box-boundary coordinates',
          });
        }
      }
    }
  }

  // ── Intersection check ────────────────────────────────────────────────────
  // Build a flat list of arrow segments for pairwise intersection testing.
  interface ArrowSeg {
    id: string;
    x1: number; y1: number;
    x2: number; y2: number;
    startId: string | undefined;
    endId: string | undefined;
  }
  const arrowSegs: ArrowSeg[] = [];
  for (const el of els) {
    if (el.type !== 'arrow' || !el.points?.length) continue;
    const last = el.points[el.points.length - 1];
    arrowSegs.push({
      id: el.id,
      x1: el.x,           y1: el.y,
      x2: el.x + last[0], y2: el.y + last[1],
      startId: el.startBinding?.elementId,
      endId:   el.endBinding?.elementId,
    });
  }

  const reported = new Set<string>();
  for (let i = 0; i < arrowSegs.length; i++) {
    for (let j = i + 1; j < arrowSegs.length; j++) {
      const a = arrowSegs[i];
      const b = arrowSegs[j];
      // Skip arrow pairs that share a source or target box — those
      // fan-in / fan-out connections converge on the same node and
      // cannot be meaningfully separated in a layered layout.
      const sharedEndpoint =
        a.startId === b.startId || a.startId === b.endId ||
        a.endId   === b.startId || a.endId   === b.endId;
      if (sharedEndpoint) continue;
      if (segmentsProperlyIntersect(a.x1, a.y1, a.x2, a.y2, b.x1, b.y1, b.x2, b.y2)) {
        if (!reported.has(a.id)) {
          errors.push({
            elementId: a.id,
            message: `Arrow intersects with arrow "${b.id}"; reorder node declarations to fix the layout`,
          });
          reported.add(a.id);
        }
      }
    }
  }

  return errors;
}

// ── Box boundary helper (used by fixExcalidrawDiagram) ───────────────────────

/**
 * Return the point on a box perimeter that lies along the direction (dx, dy)
 * from the box center.  Mirrors `boxBoundaryPoint` in elementHelpers.ts so
 * that this module has no runtime dependency on the data layer.
 */
function boxBoundaryPoint(
  cx: number, cy: number,
  w: number, h: number,
  dx: number, dy: number,
): [number, number] {
  if (dx === 0 && dy === 0) return [cx, cy];
  const tx = dx !== 0 ? (w / 2) / Math.abs(dx) : Infinity;
  const ty = dy !== 0 ? (h / 2) / Math.abs(dy) : Infinity;
  const t = Math.min(tx, ty);
  return [cx + dx * t, cy + dy * t];
}

/**
 * The result of {@link fixExcalidrawDiagram}: the corrected element array
 * plus a list of errors that could not be auto-fixed.
 */
export interface DiagramFixResult {
  /** The element array with all auto-fixable issues corrected. */
  elements: unknown[];
  /**
   * Errors that remain after auto-fixing, i.e. issues that require manual
   * intervention (missing bindings, dangling binding references, crossing
   * arrows, etc.).
   */
  remainingErrors: DiagramLintError[];
}

/**
 * Auto-fix an Excalidraw element array so that it passes
 * {@link lintExcalidrawDiagram}.
 *
 * **Fixable issues**
 * - Arrow originates from the center of its source box → the arrow's `x`/`y`
 *   origin is moved to the nearest point on the source-box perimeter along
 *   the direction of the arrow, and `points[0]` is adjusted to keep the
 *   absolute endpoint unchanged.
 * - Arrow terminates at the center of its target box → the last element of
 *   `points` is adjusted so the endpoint moves to the nearest point on the
 *   target-box perimeter.
 *
 * **Unfixable issues** (returned in `remainingErrors`)
 * - Missing `startBinding` or `endBinding`
 * - Binding that references an element ID not present in the array
 * - Two arrows that visually intersect (crossing edges) — these require
 *   reordering node declarations in the source data file so the Sugiyama
 *   barycentric heuristic produces a crossing-free layout.
 *
 * The input array is not mutated; a new array is returned.
 *
 * @param elements  The raw Excalidraw element array (any level file export).
 * @returns         A `DiagramFixResult` containing the patched element array
 *                  and any errors that still need manual attention.
 */
export function fixExcalidrawDiagram(elements: readonly unknown[]): DiagramFixResult {
  const els = elements as readonly RawEl[];
  const knownIds = new Set(els.map((el) => el.id));
  const elMap = new Map<string, RawEl>(els.map((el) => [el.id, el]));
  /** Tolerance for floating-point equality when comparing coordinates. */
  const COORDINATE_TOLERANCE = 0.5;

  const remainingErrors: DiagramLintError[] = [];
  const fixed: unknown[] = els.map((el) => {
    if (el.type !== 'arrow') return el;

    const fromId = el.startBinding?.elementId;
    const toId = el.endBinding?.elementId;

    // Collect unfixable errors and return the element unchanged.
    if (!fromId) {
      remainingErrors.push({ elementId: el.id, message: 'Arrow is missing startBinding' });
      return el;
    }
    if (!knownIds.has(fromId)) {
      remainingErrors.push({
        elementId: el.id,
        message: `Arrow startBinding references unknown element "${fromId}"`,
      });
      return el;
    }
    if (!toId) {
      remainingErrors.push({ elementId: el.id, message: 'Arrow is missing endBinding' });
      return el;
    }
    if (!knownIds.has(toId)) {
      remainingErrors.push({
        elementId: el.id,
        message: `Arrow endBinding references unknown element "${toId}"`,
      });
      return el;
    }

    let patched = { ...el, points: el.points ? [...el.points] : undefined };

    // Fix: arrow originates from the center of its source box.
    const fromEl = elMap.get(fromId)!;
    if (fromEl.width !== undefined && fromEl.height !== undefined) {
      const boxCx = fromEl.x + fromEl.width / 2;
      const boxCy = fromEl.y + fromEl.height / 2;
      if (
        Math.abs(patched.x - boxCx) < COORDINATE_TOLERANCE &&
        Math.abs(patched.y - boxCy) < COORDINATE_TOLERANCE &&
        patched.points && patched.points.length >= 2
      ) {
        // Compute the absolute endpoint of the arrow (unchanged).
        const lastPt = patched.points[patched.points.length - 1];
        const absEndX = patched.x + lastPt[0];
        const absEndY = patched.y + lastPt[1];

        // Direction from source center toward target (use absolute endpoint).
        const dx = absEndX - boxCx;
        const dy = absEndY - boxCy;
        const [newStartX, newStartY] = boxBoundaryPoint(boxCx, boxCy, fromEl.width, fromEl.height, dx, dy);

        // Adjust points[0] to remain at [0, 0] (relative to new origin).
        // Each intermediate point is stored relative to the old arrow origin; convert
        // it to be relative to the new origin by computing its absolute position and
        // subtracting the new start coordinates.
        const newPoints: [number, number][] = [
          [0, 0],
          ...patched.points.slice(1).map((pt): [number, number] => {
            const absPtX = patched.x + pt[0];
            const absPtY = patched.y + pt[1];
            return [absPtX - newStartX, absPtY - newStartY];
          }),
        ];
        // Recompute the last point to keep the absolute end correct.
        newPoints[newPoints.length - 1] = [absEndX - newStartX, absEndY - newStartY];

        patched = { ...patched, x: newStartX, y: newStartY, points: newPoints };
      }
    }

    // Fix: arrow terminates at the center of its target box.
    const toEl = elMap.get(toId)!;
    if (
      toEl.width !== undefined && toEl.height !== undefined &&
      patched.points && patched.points.length >= 2
    ) {
      const lastPt = patched.points[patched.points.length - 1];
      const endX = patched.x + lastPt[0];
      const endY = patched.y + lastPt[1];
      const boxCx = toEl.x + toEl.width / 2;
      const boxCy = toEl.y + toEl.height / 2;
      if (
        Math.abs(endX - boxCx) < COORDINATE_TOLERANCE &&
        Math.abs(endY - boxCy) < COORDINATE_TOLERANCE
      ) {
        // Direction from target center toward arrow origin (reverse direction).
        const dx = patched.x - boxCx;
        const dy = patched.y - boxCy;
        const [newEndX, newEndY] = boxBoundaryPoint(boxCx, boxCy, toEl.width, toEl.height, dx, dy);

        const newPoints: [number, number][] = [
          ...patched.points.slice(0, -1),
          [newEndX - patched.x, newEndY - patched.y],
        ];
        patched = { ...patched, points: newPoints };
      }
    }

    return patched;
  });

  // ── Intersection check (unfixable) ───────────────────────────────────────
  // After all per-arrow fixes, run a pairwise intersection test on the fixed
  // elements.  Crossing arrows require manual node reordering and cannot be
  // resolved by coordinate patching, so any crossing pairs are appended to
  // remainingErrors.
  interface ArrowSeg {
    id: string;
    x1: number; y1: number;
    x2: number; y2: number;
    startId: string | undefined;
    endId: string | undefined;
  }
  const fixedEls = fixed as readonly RawEl[];
  const arrowSegs: ArrowSeg[] = [];
  for (const el of fixedEls) {
    if (el.type !== 'arrow' || !el.points?.length) continue;
    const last = el.points[el.points.length - 1];
    arrowSegs.push({
      id: el.id,
      x1: el.x,           y1: el.y,
      x2: el.x + last[0], y2: el.y + last[1],
      startId: el.startBinding?.elementId,
      endId:   el.endBinding?.elementId,
    });
  }
  const reported = new Set<string>();
  for (let i = 0; i < arrowSegs.length; i++) {
    for (let j = i + 1; j < arrowSegs.length; j++) {
      const a = arrowSegs[i];
      const b = arrowSegs[j];
      const sharedEndpoint =
        a.startId === b.startId || a.startId === b.endId ||
        a.endId   === b.startId || a.endId   === b.endId;
      if (sharedEndpoint) continue;
      if (segmentsProperlyIntersect(a.x1, a.y1, a.x2, a.y2, b.x1, b.y1, b.x2, b.y2)) {
        if (!reported.has(a.id)) {
          remainingErrors.push({
            elementId: a.id,
            message: `Arrow intersects with arrow "${b.id}"; reorder node declarations to fix the layout`,
          });
          reported.add(a.id);
        }
      }
    }
  }

  return { elements: fixed, remainingErrors };
}

/**
 * Convert an array of Excalidraw elements into a Mermaid diagram string.
 *
 * @param elements  The raw Excalidraw element array (any level file export).
 * @param meta      Semantic annotations that can't be derived visually.
 */
export function excalidrawToMermaid(
  elements: readonly unknown[],
  meta: LevelMeta,
): string {
  const els = elements as readonly RawEl[];
  if (meta.diagramType === 'flowchart') {
    return generateFlowchart(els);
  }
  if (meta.diagramType === 'classDiagram') {
    return generateClassDiagram(els);
  }
  return generateC4Diagram(els, meta);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Convert an Excalidraw element ID to a Mermaid-safe variable name.
 * Strips the level prefix (l1-, l2-, l3-, l4-) and replaces hyphens.
 *
 * e.g. "l1-patient" → "patient", "l2-webapp" → "webapp"
 */
function toMermaidId(elementId: string): string {
  return elementId.replace(/^l\d+-/, '').replace(/-/g, '_');
}

/**
 * Parse a node label that may encode technology in a trailing parenthetical.
 *
 *   "Web App\n(Astro)"           → { name: "Web App",          tech: "Astro" }
 *   "API Gateway\n(Node.js)"     → { name: "API Gateway",      tech: "Node.js" }
 *   "Cache\nManager (Redis)"     → { name: "Cache Manager",    tech: "Redis" }
 *   "Healthcare\nPlatform"       → { name: "Healthcare Platform", tech: "" }
 */
function parseNodeLabel(raw: string): { name: string; tech: string } {
  const normalized = raw.replace(/\n/g, ' ').trim();
  const techMatch = normalized.match(/\s*\(([^)]+)\)\s*$/);
  if (techMatch) {
    const tech = techMatch[1];
    const name = normalized.slice(0, normalized.lastIndexOf('(')).trim();
    return { name, tech };
  }
  return { name: normalized, tech: '' };
}

/** Collapse newlines in an arrow label to a single space. */
function cleanLabel(raw: string): string {
  return raw.replace(/\n/g, ' ').trim();
}

// ── C4 diagram generator ──────────────────────────────────────────────────────

function generateC4Diagram(els: readonly RawEl[], meta: LevelMeta): string {
  // Build a lookup: containerId → label text (from text child elements)
  const labelByContainer: Record<string, string> = {};
  for (const el of els) {
    if (el.type === 'text' && el.containerId) {
      labelByContainer[el.containerId] = el.text ?? el.originalText ?? '';
    }
  }

  // Title: first standalone text element with a large font (the heading)
  const titleEl = els.find(
    (el) => el.type === 'text' && !el.containerId && (el.fontSize ?? 0) >= 18,
  );
  const title = titleEl
    ? (titleEl.text ?? titleEl.originalText ?? '').replace(/\n/g, ' ').trim()
    : '';

  const nodeMeta = meta.nodes ?? {};
  const boundaryNodeIds = new Set(
    (meta.boundaries ?? []).flatMap((b) => b.nodeIds),
  );

  // Arrows: elements of type 'arrow' that have both start and end bindings
  const arrows = els.filter(
    (el) => el.type === 'arrow' && el.startBinding?.elementId && el.endBinding?.elementId,
  );

  const lines: string[] = [];

  // Prepend ELK init directive so Mermaid uses its Sugiyama-style layered
  // layout engine instead of the default C4 grid.  This produces cleaner
  // edge routing that avoids intersecting lines and boxes.
  if (meta.useElk) {
    lines.push('%%{init: {"layout": "elk"}}%%');
  }

  lines.push(meta.diagramType);
  lines.push(`  title ${title}`);
  lines.push('');

  // Emit UpdateLayoutConfig when caller specifies layout parameters and ELK
  // is not enabled.  ELK handles its own node placement so UpdateLayoutConfig
  // is not needed (and has no effect) in ELK mode.
  if (meta.layoutConfig && !meta.useElk) {
    const row = meta.layoutConfig.c4ShapeInRow ?? 4;
    const boundary = meta.layoutConfig.c4BoundaryInRow ?? 2;
    lines.push(`  UpdateLayoutConfig($c4ShapeInRow="${row}", $c4BoundaryInRow="${boundary}")`);
    lines.push('');
  }

  const declaredNodes = new Set<string>();

  const declareNode = (id: string, indent = '  ') => {
    if (declaredNodes.has(id)) return;
    declaredNodes.add(id);

    const nm = nodeMeta[id];
    if (!nm) return;

    const rawLabel = labelByContainer[id] ?? '';
    const parsed = parseNodeLabel(rawLabel);
    const name = parsed.name;
    const tech = nm.tech ?? parsed.tech;
    const desc = nm.desc ?? '';
    const mId = toMermaidId(id);

    switch (nm.c4type) {
      case 'Person':
        lines.push(`${indent}Person(${mId}, "${name}", "${desc}")`);
        break;
      case 'System':
        lines.push(`${indent}System(${mId}, "${name}", "${desc}")`);
        break;
      case 'System_Ext':
        lines.push(`${indent}System_Ext(${mId}, "${name}", "${desc}")`);
        break;
      case 'Container':
        lines.push(`${indent}Container(${mId}, "${name}", "${tech}", "${desc}")`);
        break;
      case 'ContainerDb':
        lines.push(`${indent}ContainerDb(${mId}, "${name}", "${tech}", "${desc}")`);
        break;
      case 'Container_Ext':
        lines.push(`${indent}Container_Ext(${mId}, "${name}", "${tech}", "${desc}")`);
        break;
      case 'ContainerDb_Ext':
        lines.push(`${indent}ContainerDb_Ext(${mId}, "${name}", "${tech}", "${desc}")`);
        break;
      case 'Component':
        lines.push(`${indent}Component(${mId}, "${name}", "${tech}", "${desc}")`);
        break;
    }
  };

  // Nodes outside every boundary come first
  for (const id of Object.keys(nodeMeta)) {
    if (!boundaryNodeIds.has(id)) {
      declareNode(id, '  ');
    }
  }

  // Boundaries (System_Boundary / Container_Boundary blocks)
  for (const boundary of meta.boundaries ?? []) {
    lines.push('');
    lines.push(`  ${boundary.type}(${boundary.id}, "${boundary.label}") {`);
    for (const id of boundary.nodeIds) {
      declareNode(id, '    ');
    }
    lines.push('  }');
  }

  // Relationships, derived from arrow bindings
  lines.push('');
  for (const arrow of arrows) {
    const fromId = arrow.startBinding!.elementId;
    const toId = arrow.endBinding!.elementId;

    // Skip arrows whose endpoints are not declared nodes
    if (!nodeMeta[fromId] || !nodeMeta[toId]) continue;

    const rawLabel = labelByContainer[arrow.id] ?? '';
    const label = cleanLabel(rawLabel);
    const fromMId = toMermaidId(fromId);
    const toMId = toMermaidId(toId);

    lines.push(`  Rel(${fromMId}, ${toMId}, "${label}")`);
  }

  return lines.join('\n');
}

// ── classDiagram generator ────────────────────────────────────────────────────

/**
 * For Level 4 (Code), the Excalidraw arrows are manually positioned (no
 * `startBinding` / `endBinding`).  Connections are determined spatially:
 * the arrow start / end point must lie on or within the bounding box of a
 * class rectangle (with a small tolerance).
 */
function generateClassDiagram(els: readonly RawEl[]): string {
  // Build label lookup
  const labelByContainer: Record<string, string> = {};
  for (const el of els) {
    if (el.type === 'text' && el.containerId) {
      labelByContainer[el.containerId] = el.text ?? el.originalText ?? '';
    }
  }

  // Collect class boxes (rectangles that have a label)
  const classBoxes = els.filter(
    (el) => el.type === 'rectangle' && labelByContainer[el.id],
  );

  // Map element ID → class name
  const classNameById: Record<string, string> = {};

  const lines: string[] = ['classDiagram', '  direction TB', ''];

  for (const box of classBoxes) {
    const rawLabel = labelByContainer[box.id]!;
    const labelLines = rawLabel.split('\n');
    // The separator line contains box-drawing dashes (─) or hyphens
    const separatorIdx = labelLines.findIndex((l) => /[─-]{3,}/.test(l));

    const className =
      separatorIdx > 0
        ? labelLines.slice(0, separatorIdx).join(' ').trim()
        : labelLines[0].trim();

    classNameById[box.id] = className;

    const members =
      separatorIdx >= 0
        ? labelLines.slice(separatorIdx + 1).filter((l) => l.trim())
        : [];

    if (members.length > 0) {
      lines.push(`  class ${className} {`);
      for (const m of members) {
        lines.push(`    ${m.trim()}`);
      }
      lines.push('  }');
    } else {
      lines.push(`  class ${className}`);
    }
    lines.push('');
  }

  // Collect arrows and resolve connections via standard startBinding/endBinding
  const arrows = els.filter((el) => el.type === 'arrow');

  for (const arrow of arrows) {
    if (!arrow.startBinding?.elementId || !arrow.endBinding?.elementId) continue;

    const fromClass = classNameById[arrow.startBinding.elementId];
    const toClass = classNameById[arrow.endBinding.elementId];
    if (!fromClass || !toClass) continue;

    const rawLabel = labelByContainer[arrow.id] ?? '';
    const label = cleanLabel(rawLabel);

    if (label) {
      lines.push(`  ${fromClass} --> ${toClass} : ${label}`);
    } else {
      lines.push(`  ${fromClass} --> ${toClass}`);
    }
  }

  return lines.join('\n');
}

// ── flowchart generator ───────────────────────────────────────────────────────

/**
 * Extract only the display name from a raw node label.
 *
 * Handles two label styles:
 *   • Class-style (separator line):
 *       "RecordController\n─────────────────\n+getRecord(req,res)"
 *       → "RecordController"
 *   • Simple / tech-parenthetical style:
 *       "Web App\n(Astro)"  → "Web App"
 *       "Healthcare\nPlatform" → "Healthcare Platform"
 */
function extractNodeName(rawLabel: string): string {
  const labelLines = rawLabel.split('\n');
  // Match a separator line that consists of 3+ box-drawing horizontals (─, U+2500)
  // or ASCII hyphens (-). In the character class [─-], the `-` is at the end
  // and is therefore treated as a literal hyphen, not a range delimiter.
  const separatorIdx = labelLines.findIndex((l) => /^[─-]+$/.test(l));
  if (separatorIdx > 0) {
    return labelLines.slice(0, separatorIdx).join(' ').trim();
  }
  // No separator: use parseNodeLabel to strip trailing "(Tech)" annotation
  const { name } = parseNodeLabel(rawLabel);
  return name;
}

/**
 * Generate a `flowchart TB` Mermaid diagram from Excalidraw elements.
 *
 * Unlike the C4 generators (which require explicit node-type metadata) and
 * the classDiagram generator (which shows class members), this generator
 * produces a minimal directed graph with one labelled box per node and one
 * labelled arrow per connection.  Mermaid renders flowchart diagrams with
 * its built-in Dagre engine — a Sugiyama-style layered layout — so the
 * result closely mirrors the 2D SVG diagram without needing the ELK plugin.
 */
function generateFlowchart(els: readonly RawEl[]): string {
  // Build label lookup: containerId → text content
  const labelByContainer: Record<string, string> = {};
  for (const el of els) {
    if (el.type === 'text' && el.containerId) {
      labelByContainer[el.containerId] = el.text ?? el.originalText ?? '';
    }
  }

  // Collect node boxes (rectangles that have an associated label)
  const nodeBoxes = els.filter(
    (el) => el.type === 'rectangle' && labelByContainer[el.id],
  );

  const lines: string[] = ['flowchart TB', ''];

  // Emit one node declaration per box
  const mermaidIdByElementId: Record<string, string> = {};
  for (const box of nodeBoxes) {
    const rawLabel = labelByContainer[box.id]!;
    const name = extractNodeName(rawLabel);
    const mId = toMermaidId(box.id);
    mermaidIdByElementId[box.id] = mId;
    lines.push(`  ${mId}["${name.replace(/"/g, "'")}"]`);
  }

  lines.push('');

  // Emit one edge per arrow that has both start and end bindings
  const arrows = els.filter(
    (el) => el.type === 'arrow' && el.startBinding?.elementId && el.endBinding?.elementId,
  );

  for (const arrow of arrows) {
    // startBinding and endBinding are guaranteed non-null by the filter on line 461.
    const fromId = arrow.startBinding!.elementId;
    const toId = arrow.endBinding!.elementId;
    if (!mermaidIdByElementId[fromId] || !mermaidIdByElementId[toId]) continue;

    const rawLabel = labelByContainer[arrow.id] ?? '';
    const label = cleanLabel(rawLabel);
    const fromMId = mermaidIdByElementId[fromId];
    const toMId = mermaidIdByElementId[toId];

    if (label) {
      lines.push(`  ${fromMId} -- "${label.replace(/"/g, "'")}" --> ${toMId}`);
    } else {
      lines.push(`  ${fromMId} --> ${toMId}`);
    }
  }

  return lines.join('\n');
}
