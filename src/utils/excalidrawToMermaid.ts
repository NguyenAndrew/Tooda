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
  diagramType: 'C4Context' | 'C4Container' | 'C4Component' | 'classDiagram';
  /** Per-node semantic metadata, keyed by Excalidraw element ID. */
  nodes?: Record<string, NodeMeta>;
  /** Optional boundaries that group nodes visually. */
  boundaries?: BoundaryMeta[];
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

// ── Entry point ───────────────────────────────────────────────────────────────

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
  lines.push(meta.diagramType);
  lines.push(`  title ${title}`);
  lines.push('');

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
    const rawLabel = labelByContainer[box.id] ?? '';
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

  // Collect arrows and resolve connections spatially
  const arrows = els.filter((el) => el.type === 'arrow');

  for (const arrow of arrows) {
    // Compute absolute start and end points
    const startX = arrow.x;
    const startY = arrow.y;
    const lastPt = arrow.points?.[arrow.points.length - 1] ?? [0, 0];
    const endX = arrow.x + lastPt[0];
    const endY = arrow.y + lastPt[1];

    const fromBox = findBoxAtPoint(classBoxes, startX, startY);
    const toBox = findBoxAtPoint(classBoxes, endX, endY);
    if (!fromBox || !toBox || fromBox.id === toBox.id) continue;

    const fromClass = classNameById[fromBox.id];
    const toClass = classNameById[toBox.id];
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

/**
 * Find the class box whose bounding rectangle contains the given point.
 * We expand the box by `TOLERANCE` pixels on each side to handle arrows
 * that start/end exactly on the edge.
 */
function findBoxAtPoint(boxes: readonly RawEl[], px: number, py: number): RawEl | null {
  const TOLERANCE = 4;
  for (const box of boxes) {
    const x0 = box.x - TOLERANCE;
    const y0 = box.y - TOLERANCE;
    const x1 = box.x + (box.width ?? 0) + TOLERANCE;
    const y1 = box.y + (box.height ?? 0) + TOLERANCE;
    if (px >= x0 && px <= x1 && py >= y0 && py <= y1) {
      return box;
    }
  }
  // Fall back to the nearest box centre
  let nearest: RawEl | null = null;
  let minDist = Infinity;
  for (const box of boxes) {
    const cx = box.x + (box.width ?? 0) / 2;
    const cy = box.y + (box.height ?? 0) / 2;
    const dist = Math.hypot(px - cx, py - cy);
    if (dist < minDist) {
      minDist = dist;
      nearest = box;
    }
  }
  return nearest;
}
