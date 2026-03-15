/**
 * C4 Diagram Examples – single source of truth
 *
 * The Excalidraw element sets are the canonical representation of each
 * example system.  They encode the full visual model: node positions,
 * sizes, labels, arrow bindings, and relationship labels.
 *
 * Mermaid diagram strings and connection metadata are *derived* from those
 * elements at build time and stored alongside the elements so that adding a
 * new diagram only requires a single entry in the `diagrams` catalog below.
 *
 * ── Adding a new diagram ──────────────────────────────────────────────────────
 * 1. Create `src/data/excalidraw/<key>/level{1,2,3,4}Elements.ts` and `nodes.ts`
 *    following the pattern of the existing systems.
 * 2. Import the four element arrays and LEVEL_NODES here.
 * 3. Add a new entry to the `diagrams` object using the template at the bottom
 *    of this file.
 * 4. That's it – the C4 page picks up the new entry automatically.
 */

import { excalidrawToMermaid, extractConnections } from '../../utils/excalidrawToMermaid';
import type { LevelMeta } from '../../utils/excalidrawToMermaid';

import { bankingLevel1Elements } from '../excalidraw/banking/level1Elements';
import { bankingLevel2Elements } from '../excalidraw/banking/level2Elements';
import { bankingLevel3Elements } from '../excalidraw/banking/level3Elements';
import { bankingLevel4Elements } from '../excalidraw/banking/level4Elements';
import { LEVEL_NODES as bankingNodes } from '../excalidraw/banking/nodes';
import { ecommerceLevel1Elements } from '../excalidraw/ecommerce/level1Elements';
import { ecommerceLevel2Elements } from '../excalidraw/ecommerce/level2Elements';
import { ecommerceLevel3Elements } from '../excalidraw/ecommerce/level3Elements';
import { ecommerceLevel4Elements } from '../excalidraw/ecommerce/level4Elements';
import { LEVEL_NODES as ecommerceNodes } from '../excalidraw/ecommerce/nodes';
import { ridesharingLevel1Elements } from '../excalidraw/ridesharing/level1Elements';
import { ridesharingLevel2Elements } from '../excalidraw/ridesharing/level2Elements';
import { ridesharingLevel3Elements } from '../excalidraw/ridesharing/level3Elements';
import { ridesharingLevel4Elements } from '../excalidraw/ridesharing/level4Elements';
import { LEVEL_NODES as ridesharingNodes } from '../excalidraw/ridesharing/nodes';
import { toodaLevel1Elements } from '../excalidraw/tooda/level1Elements';
import { toodaLevel2Elements } from '../excalidraw/tooda/level2Elements';
import { toodaLevel3Elements } from '../excalidraw/tooda/level3Elements';
import { toodaLevel4Elements } from '../excalidraw/tooda/level4Elements';
import { LEVEL_NODES as toodaNodes } from '../excalidraw/tooda/nodes';
import { healthcareLevel1Elements } from '../excalidraw/healthcare/level1Elements';
import { healthcareLevel2Elements } from '../excalidraw/healthcare/level2Elements';
import { healthcareLevel3Elements } from '../excalidraw/healthcare/level3Elements';
import { healthcareLevel4Elements } from '../excalidraw/healthcare/level4Elements';
import { LEVEL_NODES as healthcareNodes } from '../excalidraw/healthcare/nodes';

export {
  bankingLevel1Elements, bankingLevel2Elements, bankingLevel3Elements, bankingLevel4Elements,
  ecommerceLevel1Elements, ecommerceLevel2Elements, ecommerceLevel3Elements, ecommerceLevel4Elements,
  ridesharingLevel1Elements, ridesharingLevel2Elements, ridesharingLevel3Elements, ridesharingLevel4Elements,
  toodaLevel1Elements, toodaLevel2Elements, toodaLevel3Elements, toodaLevel4Elements,
  healthcareLevel1Elements, healthcareLevel2Elements, healthcareLevel3Elements, healthcareLevel4Elements,
};

// ── Level metadata ────────────────────────────────────────────────────────────
// All levels use the flowchart type so that structural information encoded in
// the Excalidraw elements is rendered by Mermaid's built-in Dagre engine.

const levelMeta: LevelMeta = { diagramType: 'flowchart' };

// ── Diagram catalogue ─────────────────────────────────────────────────────────
// Each entry is self-contained: it holds the Excalidraw elements, 3-D node
// metadata, derived Mermaid strings, and derived connection lists for all four
// C4 levels.  The C4 page iterates over this object to render diagrams without
// any hardcoding.
//
// To add a new diagram, append an entry following the template below.

export const diagrams = {
  banking: {
    title: 'Online Banking System',
    shortTitle: 'Online Banking',
    description: 'An Online Banking System illustrated across all 4 levels of the C4 model.',
    nodes: bankingNodes,
    level1: bankingLevel1Elements,
    level2: bankingLevel2Elements,
    level3: bankingLevel3Elements,
    level4: bankingLevel4Elements,
    mermaid: {
      level1: excalidrawToMermaid(bankingLevel1Elements, levelMeta),
      level2: excalidrawToMermaid(bankingLevel2Elements, levelMeta),
      level3: excalidrawToMermaid(bankingLevel3Elements, levelMeta),
      level4: excalidrawToMermaid(bankingLevel4Elements, levelMeta),
    },
    connections: {
      level1: extractConnections(bankingLevel1Elements),
      level2: extractConnections(bankingLevel2Elements),
      level3: extractConnections(bankingLevel3Elements),
      level4: extractConnections(bankingLevel4Elements),
    },
  },
  ecommerce: {
    title: 'E-Commerce Platform',
    shortTitle: 'E-Commerce',
    description: 'An E-Commerce Platform illustrated across all 4 levels of the C4 model.',
    nodes: ecommerceNodes,
    level1: ecommerceLevel1Elements,
    level2: ecommerceLevel2Elements,
    level3: ecommerceLevel3Elements,
    level4: ecommerceLevel4Elements,
    mermaid: {
      level1: excalidrawToMermaid(ecommerceLevel1Elements, levelMeta),
      level2: excalidrawToMermaid(ecommerceLevel2Elements, levelMeta),
      level3: excalidrawToMermaid(ecommerceLevel3Elements, levelMeta),
      level4: excalidrawToMermaid(ecommerceLevel4Elements, levelMeta),
    },
    connections: {
      level1: extractConnections(ecommerceLevel1Elements),
      level2: extractConnections(ecommerceLevel2Elements),
      level3: extractConnections(ecommerceLevel3Elements),
      level4: extractConnections(ecommerceLevel4Elements),
    },
  },
  ridesharing: {
    title: 'Ride-Sharing App',
    shortTitle: 'Ride-Sharing',
    description: 'A Ride-Sharing App illustrated across all 4 levels of the C4 model.',
    nodes: ridesharingNodes,
    level1: ridesharingLevel1Elements,
    level2: ridesharingLevel2Elements,
    level3: ridesharingLevel3Elements,
    level4: ridesharingLevel4Elements,
    mermaid: {
      level1: excalidrawToMermaid(ridesharingLevel1Elements, levelMeta),
      level2: excalidrawToMermaid(ridesharingLevel2Elements, levelMeta),
      level3: excalidrawToMermaid(ridesharingLevel3Elements, levelMeta),
      level4: excalidrawToMermaid(ridesharingLevel4Elements, levelMeta),
    },
    connections: {
      level1: extractConnections(ridesharingLevel1Elements),
      level2: extractConnections(ridesharingLevel2Elements),
      level3: extractConnections(ridesharingLevel3Elements),
      level4: extractConnections(ridesharingLevel4Elements),
    },
  },
  tooda: {
    title: 'Tooda',
    shortTitle: 'Tooda',
    description: 'Tooda – a browser-based architecture diagramming tool – illustrated across all 4 levels of the C4 model.',
    nodes: toodaNodes,
    level1: toodaLevel1Elements,
    level2: toodaLevel2Elements,
    level3: toodaLevel3Elements,
    level4: toodaLevel4Elements,
    mermaid: {
      level1: excalidrawToMermaid(toodaLevel1Elements, levelMeta),
      level2: excalidrawToMermaid(toodaLevel2Elements, levelMeta),
      level3: excalidrawToMermaid(toodaLevel3Elements, levelMeta),
      level4: excalidrawToMermaid(toodaLevel4Elements, levelMeta),
    },
    connections: {
      level1: extractConnections(toodaLevel1Elements),
      level2: extractConnections(toodaLevel2Elements),
      level3: extractConnections(toodaLevel3Elements),
      level4: extractConnections(toodaLevel4Elements),
    },
  },
  healthcare: {
    title: 'Healthcare Platform',
    shortTitle: 'Healthcare',
    description: 'A Healthcare Platform illustrated across all 4 levels of the C4 model.',
    nodes: healthcareNodes,
    level1: healthcareLevel1Elements,
    level2: healthcareLevel2Elements,
    level3: healthcareLevel3Elements,
    level4: healthcareLevel4Elements,
    mermaid: {
      level1: excalidrawToMermaid(healthcareLevel1Elements, levelMeta),
      level2: excalidrawToMermaid(healthcareLevel2Elements, levelMeta),
      level3: excalidrawToMermaid(healthcareLevel3Elements, levelMeta),
      level4: excalidrawToMermaid(healthcareLevel4Elements, levelMeta),
    },
    connections: {
      level1: extractConnections(healthcareLevel1Elements),
      level2: extractConnections(healthcareLevel2Elements),
      level3: extractConnections(healthcareLevel3Elements),
      level4: extractConnections(healthcareLevel4Elements),
    },
  },
  // ── Template for new diagrams ─────────────────────────────────────────────
  // Uncomment and fill in the fields below to add a new diagram.
  //
  // <key>: {
  //   title: '<Full System Name>',
  //   shortTitle: '<Short label for the selector button>',
  //   description: '<One-sentence description for the C4 page header>',
  //   nodes: <key>Nodes,
  //   level1: <key>Level1Elements,
  //   level2: <key>Level2Elements,
  //   level3: <key>Level3Elements,
  //   level4: <key>Level4Elements,
  //   mermaid: {
  //     level1: excalidrawToMermaid(<key>Level1Elements, levelMeta),
  //     level2: excalidrawToMermaid(<key>Level2Elements, levelMeta),
  //     level3: excalidrawToMermaid(<key>Level3Elements, levelMeta),
  //     level4: excalidrawToMermaid(<key>Level4Elements, levelMeta),
  //   },
  //   connections: {
  //     level1: extractConnections(<key>Level1Elements),
  //     level2: extractConnections(<key>Level2Elements),
  //     level3: extractConnections(<key>Level3Elements),
  //     level4: extractConnections(<key>Level4Elements),
  //   },
  // },
};

// ── Backward-compat re-exports ────────────────────────────────────────────────
// Derived views kept for existing consumers (e.g. API routes).
// Object.fromEntries is intentional: it scales automatically when new entries
// are added to the diagrams catalog without requiring manual updates here.

export const mermaidDiagrams = Object.fromEntries(
  Object.entries(diagrams).map(([k, d]) => [k, d.mermaid])
) as { [K in keyof typeof diagrams]: typeof diagrams[K]['mermaid'] };

export const levelConnections = Object.fromEntries(
  Object.entries(diagrams).map(([k, d]) => [k, d.connections])
) as { [K in keyof typeof diagrams]: typeof diagrams[K]['connections'] };
