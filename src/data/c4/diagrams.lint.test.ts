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
