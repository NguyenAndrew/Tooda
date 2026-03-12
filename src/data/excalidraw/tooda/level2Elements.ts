import { makeTitle, computeLayout } from '../elementHelpers';

export const toodaLevel2Elements = [
  makeTitle('title', 'Container – Tooda', 760),
  ...computeLayout(
    [
      { id: 'l2-developer',      label: 'Developer / Architect',  color: '#bfdbfe' },
      { id: 'l2-githubPages',    label: 'GitHub Pages',           color: '#f1f5f9' },
      { id: 'l2-webApp',         label: 'Static Web App',         color: '#ddd6fe' },
      { id: 'l2-c4Page',         label: 'C4 Viewer',              color: '#ddd6fe' },
      { id: 'l2-excalidrawPage', label: 'Excalidraw Viewer',      color: '#ddd6fe' },
      { id: 'l2-apiPage',        label: 'API Explorer',           color: '#ddd6fe' },
      { id: 'l2-mermaidLib',     label: 'Mermaid Library',        color: '#f1f5f9' },
      { id: 'l2-excalidrawLib',  label: 'Excalidraw Library',     color: '#f1f5f9' },
    ],
    [
      { id: 'l2-a1', from: 'l2-developer',      to: 'l2-webApp',         label: 'Visits' },
      { id: 'l2-a2', from: 'l2-githubPages',    to: 'l2-webApp',         label: 'Hosts and serves' },
      { id: 'l2-a3', from: 'l2-webApp',         to: 'l2-c4Page',         label: 'Routes /c4 to' },
      { id: 'l2-a4', from: 'l2-webApp',         to: 'l2-excalidrawPage', label: 'Routes /excalidraw to' },
      { id: 'l2-a5', from: 'l2-webApp',         to: 'l2-apiPage',        label: 'Routes /api to' },
      { id: 'l2-a6', from: 'l2-c4Page',         to: 'l2-mermaidLib',     label: 'Renders diagrams with' },
      { id: 'l2-a7', from: 'l2-excalidrawPage', to: 'l2-excalidrawLib',  label: 'Renders diagrams with' },
    ],
  ),
];

