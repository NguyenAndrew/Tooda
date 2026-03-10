import { buildC4Elements } from '../../utils/buildC4Elements';
import { C4_LEVEL_NODES } from './nodeMetadata';
import { C4_CONNECTIONS } from './connections';

function buildForExample(example: string, prefix: string) {
  return {
    1: buildC4Elements(
      prefix + '1',
      C4_LEVEL_NODES[example][1].map(n => ({ id: n.excalidrawId, label: n.label })),
      C4_CONNECTIONS[example][1],
    ),
    2: buildC4Elements(
      prefix + '2',
      C4_LEVEL_NODES[example][2].map(n => ({ id: n.excalidrawId, label: n.label })),
      C4_CONNECTIONS[example][2],
    ),
    3: buildC4Elements(
      prefix + '3',
      C4_LEVEL_NODES[example][3].map(n => ({ id: n.excalidrawId, label: n.label })),
      C4_CONNECTIONS[example][3],
    ),
    4: buildC4Elements(
      prefix + '4',
      C4_LEVEL_NODES[example][4].map(n => ({ id: n.excalidrawId, label: n.label })),
      C4_CONNECTIONS[example][4],
    ),
  };
}

export const C4_ELEMENTS = {
  banking: buildForExample('banking', 'b'),
  ecommerce: buildForExample('ecommerce', 'ec'),
  ridesharing: buildForExample('ridesharing', 'rs'),
  tooda: buildForExample('tooda', 'td'),
};
