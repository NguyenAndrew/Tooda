import { makeTitle, computeLayout } from '../elementHelpers';

export const toodaLevel3Elements = [
  makeTitle('title', 'Component – C4 Viewer', 760),
  ...computeLayout(
    [
      { id: 'l3-developer',         label: 'Developer / Architect',                        color: '#bfdbfe' },
      // nodeDragController is declared first so the Sugiyama heuristic
      // assigns it position 0 in layer 1 — this aligns panZoomController
      // directly below it in layer 2 and avoids a skip-layer crossing.
      { id: 'l3-nodeDragController', label: 'Node Drag Controller',                         color: '#e0f2fe' },
      { id: 'l3-diagramData',       label: 'Diagram Data',                                 color: '#e0f2fe' },
      { id: 'l3-tabController',     label: 'Tab Controller',                               color: '#e0f2fe' },
      { id: 'l3-exampleSwitcher',   label: 'Example Switcher',                             color: '#e0f2fe' },
      { id: 'l3-viewToggle',        label: 'View Toggle',                                  color: '#e0f2fe' },
      { id: 'l3-mermaidRenderer',   label: 'Mermaid Renderer',                             color: '#e0f2fe' },
      { id: 'l3-panZoomController', label: 'Pan/Zoom Controller',                          color: '#e0f2fe' },
      { id: 'l3-mermaidLib',        label: 'Mermaid Library',                              color: '#f1f5f9' },
    ],
    [
      { id: 'l3-a1',  from: 'l3-developer',          to: 'l3-tabController',      label: 'Clicks level tabs' },
      { id: 'l3-a2',  from: 'l3-developer',          to: 'l3-exampleSwitcher',    label: 'Selects example' },
      { id: 'l3-a3',  from: 'l3-developer',          to: 'l3-viewToggle',         label: 'Toggles view' },
      { id: 'l3-a4',  from: 'l3-developer',          to: 'l3-panZoomController',  label: 'Pans and zooms diagram' },
      { id: 'l3-a5',  from: 'l3-developer',          to: 'l3-nodeDragController', label: 'Drags nodes in Edit mode' },
      { id: 'l3-a6',  from: 'l3-tabController',      to: 'l3-mermaidRenderer',    label: 'Triggers re-render on tab switch' },
      { id: 'l3-a7',  from: 'l3-exampleSwitcher',    to: 'l3-diagramData',        label: 'Reads diagram source from' },
      { id: 'l3-a8',  from: 'l3-exampleSwitcher',    to: 'l3-mermaidRenderer',    label: 'Triggers re-render on example switch' },
      { id: 'l3-a9',  from: 'l3-viewToggle',         to: 'l3-mermaidRenderer',    label: 'Triggers re-render when switching to Diagram view' },
      { id: 'l3-a10', from: 'l3-mermaidRenderer',    to: 'l3-mermaidLib',         label: 'Delegates SVG rendering to' },
      { id: 'l3-a11', from: 'l3-nodeDragController', to: 'l3-panZoomController',  label: 'Coordinates transform with' },
    ],
  ),
];

