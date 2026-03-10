import { makeBox, makeArrow, makeTitle } from '../elementHelpers';

export const toodaLevel3Elements = [
  makeTitle('title', 'Component – C4 Viewer', 760),
  ...makeBox('l3-developer', 40, 100, 200, 60, 'Developer / Architect', '#bfdbfe'),
  ...makeBox('l3-mermaidLib', 40, 200, 200, 60, 'Mermaid Library', '#f1f5f9'),
  ...makeBox('l3-diagramData', 280, 100, 200, 60, 'Diagram Data', '#e0f2fe'),
  ...makeBox('l3-tabController', 280, 200, 200, 60, 'Tab Controller', '#e0f2fe'),
  ...makeBox('l3-exampleSwitcher', 280, 300, 200, 60, 'Example Switcher', '#e0f2fe'),
  ...makeBox('l3-viewToggle', 520, 100, 200, 60, 'View Toggle', '#e0f2fe'),
  ...makeBox('l3-mermaidRenderer', 520, 200, 200, 60, 'Mermaid Renderer', '#e0f2fe'),
  ...makeBox('l3-panZoomController', 520, 300, 200, 60, 'Pan/Zoom Controller', '#e0f2fe'),
  ...makeBox('l3-nodeDragController', 280, 400, 200, 60, 'Node Drag Controller', '#e0f2fe'),
  // Arrows
  ...makeArrow('l3-a1', 'l3-developer', 'l3-tabController', 140, 130, 140, 100, 'Clicks level tabs'),
  ...makeArrow('l3-a2', 'l3-developer', 'l3-exampleSwitcher', 140, 130, 140, 200, 'Selects example'),
  ...makeArrow('l3-a3', 'l3-developer', 'l3-viewToggle', 140, 130, 380, 0, 'Toggles view'),
  ...makeArrow('l3-a4', 'l3-developer', 'l3-panZoomController', 140, 130, 380, 200, 'Pans and zooms diagram'),
  ...makeArrow('l3-a5', 'l3-developer', 'l3-nodeDragController', 140, 130, 140, 300, 'Drags nodes in Edit mode'),
  ...makeArrow('l3-a6', 'l3-tabController', 'l3-mermaidRenderer', 380, 230, 140, 0, 'Triggers re-render on tab switch'),
  ...makeArrow('l3-a7', 'l3-exampleSwitcher', 'l3-diagramData', 380, 330, 0, -200, 'Reads diagram source from'),
  ...makeArrow('l3-a8', 'l3-exampleSwitcher', 'l3-mermaidRenderer', 380, 330, 140, -100, 'Triggers re-render on example switch'),
  ...makeArrow('l3-a9', 'l3-viewToggle', 'l3-mermaidRenderer', 620, 130, 0, 100, 'Triggers re-render when switching to Diagram view'),
  ...makeArrow('l3-a10', 'l3-mermaidRenderer', 'l3-mermaidLib', 620, 230, -580, 0, 'Delegates SVG rendering to'),
  ...makeArrow('l3-a11', 'l3-nodeDragController', 'l3-panZoomController', 380, 430, 140, -100, 'Coordinates transform with'),
];
