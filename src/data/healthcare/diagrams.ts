/**
 * Healthcare Platform – single source of truth
 *
 * The Excalidraw element sets are the canonical representation of the
 * Healthcare Platform architecture.  They encode the full visual model:
 * node positions, sizes, labels, arrow bindings, and relationship labels.
 *
 * Mermaid diagram strings are *derived* from those elements by the
 * `excalidrawToMermaid` converter using the `flowchart` type, which
 * generates `flowchart TB` syntax rendered by Mermaid's built-in Dagre
 * engine (a Sugiyama-style layered layout) without requiring ELK.
 */

import { excalidrawToMermaid, extractConnections } from '../../utils/excalidrawToMermaid';
import type { LevelMeta } from '../../utils/excalidrawToMermaid';

export { level1Elements } from '../excalidraw/level1Elements';
export { level2Elements } from '../excalidraw/level2Elements';
export { level3Elements } from '../excalidraw/level3Elements';
export { level4Elements } from '../excalidraw/level4Elements';

import { level1Elements } from '../excalidraw/level1Elements';
import { level2Elements } from '../excalidraw/level2Elements';
import { level3Elements } from '../excalidraw/level3Elements';
import { level4Elements } from '../excalidraw/level4Elements';

// ── Level 1 – System Context ──────────────────────────────────────────────────

const level1Meta: LevelMeta = {
  diagramType: 'flowchart',
};

// ── Level 2 – Container ───────────────────────────────────────────────────────

const level2Meta: LevelMeta = {
  diagramType: 'flowchart',
};

// ── Level 3 – Component ───────────────────────────────────────────────────────

const level3Meta: LevelMeta = {
  diagramType: 'flowchart',
};

// ── Level 4 – Code ────────────────────────────────────────────────────────────
// flowchart: all structural information (classes, members, relationships)
// is encoded in the Excalidraw elements; no extra metadata is needed.

const level4Meta: LevelMeta = {
  diagramType: 'flowchart',
};

// ── Derived Mermaid diagrams ───────────────────────────────────────────────────
// These strings are computed at build time from the Excalidraw elements above.

export const mermaidDiagrams = {
  level1: excalidrawToMermaid(level1Elements, level1Meta),
  level2: excalidrawToMermaid(level2Elements, level2Meta),
  level3: excalidrawToMermaid(level3Elements, level3Meta),
  level4: excalidrawToMermaid(level4Elements, level4Meta),
};

// ── Derived connections for 3D diagram ───────────────────────────────────────
// Connections are derived from the Excalidraw arrows so the 3D diagram uses
// Excalidraw as the source of truth for which boxes are connected.

export const levelConnections = {
  level1: extractConnections(level1Elements),
  level2: extractConnections(level2Elements),
  level3: extractConnections(level3Elements),
  level4: extractConnections(level4Elements),
};
