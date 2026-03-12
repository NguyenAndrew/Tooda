import { describe, it, expect } from 'vitest';
import { lintExcalidrawDiagram } from '../../utils/excalidrawToMermaid';
import { diagrams } from './diagrams';

/**
 * Lint all C4 diagram element arrays for Sugiyama-style compatibility.
 *
 * Sugiyama-style layout (Mermaid `flowchart TB` via Dagre) requires every
 * arrow to be bound at both ends so the layout engine can build a proper
 * directed acyclic graph.  This suite validates that no arrow is silently
 * dropped by `excalidrawToMermaid` due to missing or dangling bindings.
 *
 * It also verifies that arrow endpoints are placed on box boundaries rather
 * than at box centres, so that the Excalidraw view renders clean connections
 * that originate from the edge of each shape.
 *
 * Finally, it checks that no two arrows visually intersect (crossing edges),
 * which would indicate a node ordering problem in the diagram declaration.
 */
describe('C4 diagrams – diagram lint', () => {
  for (const [name, diagram] of Object.entries(diagrams)) {
    for (const level of ['level1', 'level2', 'level3', 'level4'] as const) {
      it(`${name}/${level} has no lint errors`, () => {
        const errors = lintExcalidrawDiagram(diagram[level]);
        expect(errors).toEqual([]);
      });
    }
  }
});

describe('lintExcalidrawDiagram – centre-origin rule', () => {
  it('reports an error when an arrow originates from the centre of its source box', () => {
    const box = {
      id: 'box-a', type: 'rectangle',
      x: 0, y: 0, width: 200, height: 60,
    };
    // Arrow starting exactly at the centre of box-a (100, 30)
    const arrow = {
      id: 'arr-1', type: 'arrow',
      x: 100, y: 30,
      points: [[0, 0], [0, 100]] as [number, number][],
      startBinding: { elementId: 'box-a' },
      endBinding: { elementId: 'box-b' },
    };
    const boxB = {
      id: 'box-b', type: 'rectangle',
      x: 0, y: 200, width: 200, height: 60,
    };
    const errors = lintExcalidrawDiagram([box, arrow, boxB]);
    expect(errors.some(e => e.message.includes('originates from the center'))).toBe(true);
  });

  it('reports an error when an arrow terminates at the centre of its target box', () => {
    const boxA = {
      id: 'box-a', type: 'rectangle',
      x: 0, y: 0, width: 200, height: 60,
    };
    // Arrow ending exactly at the centre of box-b (100, 230)
    const arrow = {
      id: 'arr-1', type: 'arrow',
      x: 100, y: 60,
      points: [[0, 0], [0, 170]] as [number, number][],
      startBinding: { elementId: 'box-a' },
      endBinding: { elementId: 'box-b' },
    };
    const boxB = {
      id: 'box-b', type: 'rectangle',
      x: 0, y: 200, width: 200, height: 60,
    };
    const errors = lintExcalidrawDiagram([boxA, arrow, boxB]);
    expect(errors.some(e => e.message.includes('terminates at the center'))).toBe(true);
  });

  it('passes when an arrow uses box-boundary coordinates', () => {
    const boxA = {
      id: 'box-a', type: 'rectangle',
      x: 0, y: 0, width: 200, height: 60,
    };
    const boxB = {
      id: 'box-b', type: 'rectangle',
      x: 0, y: 200, width: 200, height: 60,
    };
    // Arrow from bottom edge of boxA (100, 60) to top edge of boxB (100, 200)
    const arrow = {
      id: 'arr-1', type: 'arrow',
      x: 100, y: 60,
      points: [[0, 0], [0, 140]] as [number, number][],
      startBinding: { elementId: 'box-a' },
      endBinding: { elementId: 'box-b' },
    };
    const errors = lintExcalidrawDiagram([boxA, arrow, boxB]);
    expect(errors).toEqual([]);
  });
});

describe('lintExcalidrawDiagram – arrow intersection rule', () => {
  // Helper: create a minimal box and boundary-connected arrow for tests.
  function makeBox(id: string, x: number, y: number) {
    return { id, type: 'rectangle', x, y, width: 200, height: 60 };
  }
  function makeArrow(
    id: string, startId: string, endId: string,
    x1: number, y1: number, x2: number, y2: number,
  ) {
    return {
      id, type: 'arrow',
      x: x1, y: y1,
      points: [[0, 0], [x2 - x1, y2 - y1]] as [number, number][],
      startBinding: { elementId: startId },
      endBinding:   { elementId: endId },
    };
  }

  it('reports an error when two arrows cross (X-shaped intersection)', () => {
    // Layer 0 (y=100): boxA (centre x=140) and boxB (centre x=380)
    // Layer 1 (y=260): boxC (centre x=140) and boxD (centre x=380)
    // Arrows: A→D (goes right) and B→C (goes left) — they form an X.
    const boxA = makeBox('box-a', 40,  100);   // layer 0 left
    const boxB = makeBox('box-b', 280, 100);   // layer 0 right
    const boxC = makeBox('box-c', 40,  260);   // layer 1 left
    const boxD = makeBox('box-d', 280, 260);   // layer 1 right
    const arrAD = makeArrow('arr-ad', 'box-a', 'box-d', 140, 160, 380, 260);
    const arrBC = makeArrow('arr-bc', 'box-b', 'box-c', 380, 160, 140, 260);
    const errors = lintExcalidrawDiagram([boxA, boxB, boxC, boxD, arrAD, arrBC]);
    expect(errors.some(e => e.message.includes('intersects with arrow'))).toBe(true);
  });

  it('does not report an intersection for arrows that share a source box', () => {
    // Two arrows fan out from the same source — they share a startId so
    // the rule skips them even though their segments are near each other.
    const src  = makeBox('src',  40,  100);
    const dst1 = makeBox('dst1', 40,  260);
    const dst2 = makeBox('dst2', 280, 260);
    const arr1 = makeArrow('arr-1', 'src', 'dst1', 140, 160, 140, 260);
    const arr2 = makeArrow('arr-2', 'src', 'dst2', 140, 160, 380, 260);
    const errors = lintExcalidrawDiagram([src, dst1, dst2, arr1, arr2]);
    expect(errors.filter(e => e.message.includes('intersects with arrow'))).toEqual([]);
  });

  it('does not report an intersection for arrows that share a target box', () => {
    // Two arrows converge on the same target — shared endId, so skipped.
    const src1 = makeBox('src1', 40,  100);
    const src2 = makeBox('src2', 280, 100);
    const dst  = makeBox('dst',  40,  260);
    const arr1 = makeArrow('arr-1', 'src1', 'dst', 140, 160, 140, 260);
    const arr2 = makeArrow('arr-2', 'src2', 'dst', 380, 160, 140, 260);
    const errors = lintExcalidrawDiagram([src1, src2, dst, arr1, arr2]);
    expect(errors.filter(e => e.message.includes('intersects with arrow'))).toEqual([]);
  });

  it('passes when two arrows are parallel and do not cross', () => {
    // A→C (left column, straight down) and B→D (right column, straight down).
    const boxA = makeBox('box-a', 40,  100);
    const boxB = makeBox('box-b', 280, 100);
    const boxC = makeBox('box-c', 40,  260);
    const boxD = makeBox('box-d', 280, 260);
    const arrAC = makeArrow('arr-ac', 'box-a', 'box-c', 140, 160, 140, 260);
    const arrBD = makeArrow('arr-bd', 'box-b', 'box-d', 380, 160, 380, 260);
    const errors = lintExcalidrawDiagram([boxA, boxB, boxC, boxD, arrAC, arrBD]);
    expect(errors).toEqual([]);
  });
});
