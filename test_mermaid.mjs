import { excalidrawToMermaid } from './src/utils/excalidrawToMermaid.ts';
import { level4Elements } from './src/data/excalidraw/level4Elements.ts';

const level4Meta = { diagramType: 'classDiagram' };
const mermaid = excalidrawToMermaid(level4Elements, level4Meta);
console.log(mermaid);
