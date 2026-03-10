/**
 * Healthcare Platform – single source of truth
 *
 * The Excalidraw element sets are the canonical representation of the
 * Healthcare Platform architecture.  They encode the full visual model:
 * node positions, sizes, labels, arrow bindings, and relationship labels.
 *
 * Mermaid diagram strings are *derived* from those elements by the
 * `excalidrawToMermaid` converter, supplemented only by the thin semantic
 * metadata below (C4 node type, narrative description, and technology strings
 * that are not embedded in the Excalidraw labels).
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
  diagramType: 'C4Context',
  nodes: {
    'l1-patient':  { c4type: 'Person',     desc: 'Books appointments and views medical records.' },
    'l1-doctor':   { c4type: 'Person',     desc: 'Views patient records and orders tests.' },
    'l1-admin':    { c4type: 'Person',     desc: 'Manages users and platform configuration.' },
    'l1-platform': { c4type: 'System',     desc: 'Provides appointment scheduling, electronic medical records, and billing.' },
    'l1-pharmacy': { c4type: 'System_Ext', desc: 'Receives prescriptions and dispenses medication.' },
    'l1-insurance':{ c4type: 'System_Ext', desc: 'Verifies patient coverage and processes claims.' },
    'l1-lab':      { c4type: 'System_Ext', desc: 'Receives test orders and returns results.' },
  },
  boundaries: [
    {
      id: 'hp',
      label: 'Healthcare Platform',
      type: 'System_Boundary',
      nodeIds: ['l1-platform'],
    },
    {
      id: 'ext',
      label: 'External Systems',
      type: 'Enterprise_Boundary',
      nodeIds: ['l1-pharmacy', 'l1-insurance', 'l1-lab'],
    },
  ],
  // Use ELK (Sugiyama-style layered layout) for cleaner edge routing that
  // avoids intersecting lines and boxes, matching the 2D SVG diagram style.
  useElk: true,
};

// ── Level 2 – Container ───────────────────────────────────────────────────────

const level2Meta: LevelMeta = {
  diagramType: 'C4Container',
  nodes: {
    'l2-patient': { c4type: 'Person',      desc: 'Books appointments and views medical records.' },
    'l2-doctor':  { c4type: 'Person',      desc: 'Views patient records and orders tests.' },
    'l2-webapp':  { c4type: 'Container',   desc: 'Delivers the web front-end to users via their browser.' },
    'l2-mobile':  { c4type: 'Container',   desc: 'Provides healthcare access on mobile devices.' },
    'l2-api':     { c4type: 'Container',   desc: 'Routes requests and enforces authentication.' },
    'l2-emr':     { c4type: 'Container',   desc: 'Manages electronic medical records.' },
    'l2-appt':    { c4type: 'Container',   tech: 'Node.js', desc: 'Handles appointment scheduling and reminders.' },
    'l2-billing': { c4type: 'Container',   tech: 'Node.js', desc: 'Processes billing and insurance claims.' },
    'l2-db':      { c4type: 'ContainerDb', desc: 'Stores patient records, appointments, and billing data.' },
    'l2-queue':   { c4type: 'Container',   desc: 'Decouples async communication between services.' },
  },
  boundaries: [
    {
      id: 'hp',
      label: 'Healthcare Platform',
      type: 'System_Boundary',
      nodeIds: ['l2-webapp', 'l2-api', 'l2-mobile', 'l2-emr', 'l2-appt', 'l2-billing', 'l2-db', 'l2-queue'],
    },
  ],
  // Use ELK (Sugiyama-style layered layout) for cleaner edge routing that
  // avoids intersecting lines and boxes, matching the 2D SVG diagram style.
  useElk: true,
};

// ── Level 3 – Component ───────────────────────────────────────────────────────

const level3Meta: LevelMeta = {
  diagramType: 'C4Component',
  nodes: {
    'l3-gateway': { c4type: 'Container_Ext',   tech: 'Node.js',       desc: 'Routes authenticated requests to the EMR Service.' },
    'l3-db':      { c4type: 'ContainerDb_Ext', desc: 'Stores medical records.' },
    'l3-ctrl':    { c4type: 'Component', tech: 'Express Router',  desc: 'Exposes REST endpoints for medical records.' },
    'l3-svc':     { c4type: 'Component', tech: 'Node.js module',  desc: 'Business logic for creating and retrieving records.' },
    'l3-repo':    { c4type: 'Component', tech: 'Node.js module',  desc: 'Abstracts database access for medical records.' },
    'l3-auth':    { c4type: 'Component', tech: 'Node.js module',  desc: 'Validates JWT tokens on incoming requests.' },
    'l3-audit':   { c4type: 'Component', tech: 'Node.js module',  desc: 'Logs all record access for compliance.' },
    'l3-cache':   { c4type: 'Component', tech: 'Redis client',    desc: 'Caches frequently accessed records.' },
  },
  boundaries: [
    {
      id: 'emr',
      label: 'EMR Service',
      type: 'Container_Boundary',
      nodeIds: ['l3-ctrl', 'l3-svc', 'l3-repo', 'l3-auth', 'l3-audit', 'l3-cache'],
    },
  ],
  // Use ELK (Sugiyama-style layered layout) for cleaner edge routing that
  // avoids intersecting lines and boxes, matching the 2D SVG diagram style.
  useElk: true,
};

// ── Level 4 – Code ────────────────────────────────────────────────────────────
// classDiagram: all structural information (classes, members, relationships)
// is encoded in the Excalidraw elements; no extra metadata is needed.

const level4Meta: LevelMeta = {
  diagramType: 'classDiagram',
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
