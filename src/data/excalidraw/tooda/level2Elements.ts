import { makeBox, makeArrow, makeTitle } from '../elementHelpers';

export const toodaLevel2Elements = [
  makeTitle('title', 'Container – Tooda', 760),
  ...makeBox('l2-developer', 40, 100, 200, 60, 'Developer / Architect', '#bfdbfe'),
  ...makeBox('l2-githubPages', 40, 200, 200, 60, 'GitHub Pages', '#f1f5f9'),
  ...makeBox('l2-mermaidLib', 40, 300, 200, 60, 'Mermaid Library', '#f1f5f9'),
  ...makeBox('l2-excalidrawLib', 40, 400, 200, 60, 'Excalidraw Library', '#f1f5f9'),
  ...makeBox('l2-webApp', 280, 100, 200, 60, 'Static Web App', '#ddd6fe'),
  ...makeBox('l2-c4Page', 280, 200, 200, 60, 'C4 Viewer', '#ddd6fe'),
  ...makeBox('l2-excalidrawPage', 280, 300, 200, 60, 'Excalidraw Viewer', '#ddd6fe'),
  ...makeBox('l2-apiPage', 280, 400, 200, 60, 'API Explorer', '#ddd6fe'),
  // Arrows
  ...makeArrow('l2-a1', 'l2-developer', 'l2-webApp', 140, 130, 140, 0, 'Visits'),
  ...makeArrow('l2-a2', 'l2-githubPages', 'l2-webApp', 140, 230, 140, -100, 'Hosts and serves'),
  ...makeArrow('l2-a3', 'l2-webApp', 'l2-c4Page', 380, 130, 0, 100, 'Routes /c4 to'),
  ...makeArrow('l2-a4', 'l2-webApp', 'l2-excalidrawPage', 380, 130, 0, 200, 'Routes /excalidraw to'),
  ...makeArrow('l2-a5', 'l2-webApp', 'l2-apiPage', 380, 130, 0, 300, 'Routes /api to'),
  ...makeArrow('l2-a6', 'l2-c4Page', 'l2-mermaidLib', 380, 230, -240, 100, 'Renders diagrams with'),
  ...makeArrow('l2-a7', 'l2-excalidrawPage', 'l2-excalidrawLib', 380, 330, -240, 100, 'Renders diagrams with'),
];
