import { computeLayout } from '../elementHelpers';

export const toodaLevel4Elements = [
  ...computeLayout(
    [
      { id: 'l4-entry',      label: 'DiagramEntry\n─────────────────\n+title: string\n+description: string\n+level1: string\n+level2: string\n+level3: string\n+level4: string',                                 color: '#bfdbfe', width: 220, height: 140 },
      { id: 'l4-collection', label: 'DiagramCollection\n─────────────────\n+banking: DiagramEntry\n+ecommerce: DiagramEntry\n+ridesharing: DiagramEntry\n+tooda: DiagramEntry',                                  color: '#bbf7d0', width: 220, height: 120 },
      { id: 'l4-logger',     label: 'Logger\n─────────────────\n-prefix: string\n+debug(msg: string) void\n+info(msg: string) void\n+warn(msg: string) void\n+error(msg: string) void',                         color: '#fde68a', width: 220, height: 120 },
      { id: 'l4-config',     label: 'MermaidConfig\n─────────────────\n+startOnLoad: boolean\n+theme: string',                                                                                                   color: '#f3e8ff', width: 220, height: 100 },
    ],
    [
      { id: 'l4-a1', from: 'l4-collection', to: 'l4-entry',  label: 'contains' },
      { id: 'l4-a2', from: 'l4-logger',     to: 'l4-config', label: 'used alongside' },
    ],
    { hStep: 260, vGap: 60 },
  ),
];

