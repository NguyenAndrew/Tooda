import { makeBox, makeArrow, makeTitle } from '../elementHelpers';

export const toodaLevel1Elements = [
  makeTitle('title', 'System Context – Tooda', 760),
  ...makeBox('l1-developer', 40, 100, 200, 60, 'Developer / Architect', '#bfdbfe'),
  ...makeBox('l1-tooda', 280, 100, 200, 60, 'Tooda', '#bbf7d0'),
  ...makeBox('l1-githubPages', 520, 100, 200, 60, 'GitHub Pages', '#f1f5f9'),
  ...makeBox('l1-mermaid', 160, 260, 200, 60, 'Mermaid', '#f1f5f9'),
  ...makeBox('l1-excalidraw', 420, 260, 200, 60, 'Excalidraw', '#f1f5f9'),
  // Arrows
  ...makeArrow('l1-a1', 'l1-developer', 'l1-tooda', 140, 130, 140, 0, 'Browses and creates diagrams using'),
  ...makeArrow('l1-a2', 'l1-tooda', 'l1-githubPages', 380, 130, 140, 0, 'Is hosted and served by'),
  ...makeArrow('l1-a3', 'l1-tooda', 'l1-mermaid', 380, 130, -120, 160, 'Renders C4 diagrams with'),
  ...makeArrow('l1-a4', 'l1-tooda', 'l1-excalidraw', 380, 130, 140, 160, 'Renders freehand diagrams with'),
];
