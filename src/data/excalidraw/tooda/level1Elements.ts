import { makeTitle, computeLayout } from '../elementHelpers';

export const toodaLevel1Elements = [
  makeTitle('title', 'System Context – Tooda', 760),
  ...computeLayout(
    [
      { id: 'l1-developer',   label: 'Developer / Architect',  color: '#bfdbfe' },
      { id: 'l1-tooda',       label: 'Tooda',                  color: '#bbf7d0' },
      { id: 'l1-githubPages', label: 'GitHub Pages',           color: '#f1f5f9' },
      { id: 'l1-mermaid',     label: 'Mermaid',                color: '#f1f5f9' },
      { id: 'l1-excalidraw',  label: 'Excalidraw',             color: '#f1f5f9' },
    ],
    [
      { id: 'l1-a1', from: 'l1-developer', to: 'l1-tooda',       label: 'Browses and creates diagrams using' },
      { id: 'l1-a2', from: 'l1-tooda',     to: 'l1-githubPages', label: 'Is hosted and served by' },
      { id: 'l1-a3', from: 'l1-tooda',     to: 'l1-mermaid',     label: 'Renders C4 diagrams with' },
      { id: 'l1-a4', from: 'l1-tooda',     to: 'l1-excalidraw',  label: 'Renders freehand diagrams with' },
    ],
  ),
];

