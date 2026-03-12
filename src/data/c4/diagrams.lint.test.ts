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
 */
describe('C4 diagrams – Sugiyama-style lint', () => {
  for (const [name, diagram] of Object.entries(diagrams)) {
    for (const level of ['level1', 'level2', 'level3', 'level4'] as const) {
      it(`${name}/${level} has no unbound arrows`, () => {
        const errors = lintExcalidrawDiagram(diagram[level]);
        expect(errors).toEqual([]);
      });
    }
  }
});
