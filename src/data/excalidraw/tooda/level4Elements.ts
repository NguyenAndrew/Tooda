import { makeBox, makeArrow } from '../elementHelpers';

export const toodaLevel4Elements = [
  ...makeBox('l4-entry', 40, 80, 220, 140,
    'DiagramEntry\n─────────────────\n+title: string\n+description: string\n+level1: string\n+level2: string\n+level3: string\n+level4: string', '#bfdbfe'),
  ...makeBox('l4-collection', 300, 80, 220, 120,
    'DiagramCollection\n─────────────────\n+banking: DiagramEntry\n+ecommerce: DiagramEntry\n+ridesharing: DiagramEntry\n+tooda: DiagramEntry', '#bbf7d0'),
  ...makeBox('l4-logger', 560, 80, 220, 120,
    'Logger\n─────────────────\n-prefix: string\n+debug(msg: string) void\n+info(msg: string) void\n+warn(msg: string) void\n+error(msg: string) void', '#fde68a'),
  ...makeBox('l4-config', 300, 280, 220, 100,
    'MermaidConfig\n─────────────────\n+startOnLoad: boolean\n+theme: string', '#f3e8ff'),
  // Arrows
  ...makeArrow('l4-a1', 'l4-collection', 'l4-entry', 410, 140, -260, 0, 'contains'),
  ...makeArrow('l4-a2', 'l4-logger', 'l4-config', 670, 140, -260, 200, 'used alongside'),
];
