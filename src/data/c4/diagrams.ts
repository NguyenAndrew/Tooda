/**
 * C4 Diagram Examples – single source of truth
 *
 * The Excalidraw element sets are the canonical representation of each
 * example system.  They encode the full visual model: node positions,
 * sizes, labels, arrow bindings, and relationship labels.
 *
 * Mermaid diagram strings are *derived* from those elements by the
 * `excalidrawToMermaid` converter using the `flowchart` type, which
 * generates `flowchart TB` syntax rendered by Mermaid's built-in Dagre
 * engine (a Sugiyama-style layered layout) without requiring ELK.
 */

import { excalidrawToMermaid, extractConnections } from '../../utils/excalidrawToMermaid';
import type { LevelMeta } from '../../utils/excalidrawToMermaid';

import { bankingLevel1Elements } from '../excalidraw/banking/level1Elements';
import { bankingLevel2Elements } from '../excalidraw/banking/level2Elements';
import { bankingLevel3Elements } from '../excalidraw/banking/level3Elements';
import { bankingLevel4Elements } from '../excalidraw/banking/level4Elements';
import { ecommerceLevel1Elements } from '../excalidraw/ecommerce/level1Elements';
import { ecommerceLevel2Elements } from '../excalidraw/ecommerce/level2Elements';
import { ecommerceLevel3Elements } from '../excalidraw/ecommerce/level3Elements';
import { ecommerceLevel4Elements } from '../excalidraw/ecommerce/level4Elements';
import { ridesharingLevel1Elements } from '../excalidraw/ridesharing/level1Elements';
import { ridesharingLevel2Elements } from '../excalidraw/ridesharing/level2Elements';
import { ridesharingLevel3Elements } from '../excalidraw/ridesharing/level3Elements';
import { ridesharingLevel4Elements } from '../excalidraw/ridesharing/level4Elements';
import { toodaLevel1Elements } from '../excalidraw/tooda/level1Elements';
import { toodaLevel2Elements } from '../excalidraw/tooda/level2Elements';
import { toodaLevel3Elements } from '../excalidraw/tooda/level3Elements';
import { toodaLevel4Elements } from '../excalidraw/tooda/level4Elements';

export {
  bankingLevel1Elements, bankingLevel2Elements, bankingLevel3Elements, bankingLevel4Elements,
  ecommerceLevel1Elements, ecommerceLevel2Elements, ecommerceLevel3Elements, ecommerceLevel4Elements,
  ridesharingLevel1Elements, ridesharingLevel2Elements, ridesharingLevel3Elements, ridesharingLevel4Elements,
  toodaLevel1Elements, toodaLevel2Elements, toodaLevel3Elements, toodaLevel4Elements,
};

// ── Level metadata ────────────────────────────────────────────────────────────
// All levels use the flowchart type so that structural information encoded in
// the Excalidraw elements is rendered by Mermaid's built-in Dagre engine.

const levelMeta: LevelMeta = { diagramType: 'flowchart' };

// ── Diagram catalogue ─────────────────────────────────────────────────────────

export const diagrams = {
  banking: {
    title: 'Online Banking System',
    description: 'An Online Banking System illustrated across all 4 levels of the C4 model.',
    level1: bankingLevel1Elements,
    level2: bankingLevel2Elements,
    level3: bankingLevel3Elements,
    level4: bankingLevel4Elements,
  },
  ecommerce: {
    title: 'E-Commerce Platform',
    description: 'An E-Commerce Platform illustrated across all 4 levels of the C4 model.',
    level1: ecommerceLevel1Elements,
    level2: ecommerceLevel2Elements,
    level3: ecommerceLevel3Elements,
    level4: ecommerceLevel4Elements,
  },
  ridesharing: {
    title: 'Ride-Sharing App',
    description: 'A Ride-Sharing App illustrated across all 4 levels of the C4 model.',
    level1: ridesharingLevel1Elements,
    level2: ridesharingLevel2Elements,
    level3: ridesharingLevel3Elements,
    level4: ridesharingLevel4Elements,
  },
  tooda: {
    title: 'Tooda',
    description: 'Tooda – a browser-based architecture diagramming tool – illustrated across all 4 levels of the C4 model.',
    level1: toodaLevel1Elements,
    level2: toodaLevel2Elements,
    level3: toodaLevel3Elements,
    level4: toodaLevel4Elements,
  },
};

// ── Derived Mermaid diagrams ───────────────────────────────────────────────────
// These strings are computed at build time from the Excalidraw elements above.

export const mermaidDiagrams = {
  banking: {
    level1: excalidrawToMermaid(bankingLevel1Elements, levelMeta),
    level2: excalidrawToMermaid(bankingLevel2Elements, levelMeta),
    level3: excalidrawToMermaid(bankingLevel3Elements, levelMeta),
    level4: excalidrawToMermaid(bankingLevel4Elements, levelMeta),
  },
  ecommerce: {
    level1: excalidrawToMermaid(ecommerceLevel1Elements, levelMeta),
    level2: excalidrawToMermaid(ecommerceLevel2Elements, levelMeta),
    level3: excalidrawToMermaid(ecommerceLevel3Elements, levelMeta),
    level4: excalidrawToMermaid(ecommerceLevel4Elements, levelMeta),
  },
  ridesharing: {
    level1: excalidrawToMermaid(ridesharingLevel1Elements, levelMeta),
    level2: excalidrawToMermaid(ridesharingLevel2Elements, levelMeta),
    level3: excalidrawToMermaid(ridesharingLevel3Elements, levelMeta),
    level4: excalidrawToMermaid(ridesharingLevel4Elements, levelMeta),
  },
  tooda: {
    level1: excalidrawToMermaid(toodaLevel1Elements, levelMeta),
    level2: excalidrawToMermaid(toodaLevel2Elements, levelMeta),
    level3: excalidrawToMermaid(toodaLevel3Elements, levelMeta),
    level4: excalidrawToMermaid(toodaLevel4Elements, levelMeta),
  },
};

// ── Derived connections ────────────────────────────────────────────────────────
// Connections are derived from the Excalidraw arrows so that consumers can use
// Excalidraw as the source of truth for which boxes are connected.

export const levelConnections = {
  banking: {
    level1: extractConnections(bankingLevel1Elements),
    level2: extractConnections(bankingLevel2Elements),
    level3: extractConnections(bankingLevel3Elements),
    level4: extractConnections(bankingLevel4Elements),
  },
  ecommerce: {
    level1: extractConnections(ecommerceLevel1Elements),
    level2: extractConnections(ecommerceLevel2Elements),
    level3: extractConnections(ecommerceLevel3Elements),
    level4: extractConnections(ecommerceLevel4Elements),
  },
  ridesharing: {
    level1: extractConnections(ridesharingLevel1Elements),
    level2: extractConnections(ridesharingLevel2Elements),
    level3: extractConnections(ridesharingLevel3Elements),
    level4: extractConnections(ridesharingLevel4Elements),
  },
  tooda: {
    level1: extractConnections(toodaLevel1Elements),
    level2: extractConnections(toodaLevel2Elements),
    level3: extractConnections(toodaLevel3Elements),
    level4: extractConnections(toodaLevel4Elements),
  },
};
