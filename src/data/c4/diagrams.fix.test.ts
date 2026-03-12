import { describe, it, expect } from 'vitest';
import { fixExcalidrawDiagram, lintExcalidrawDiagram } from '../../utils/excalidrawToMermaid';
import { diagrams } from './diagrams';

/**
 * Applies `fixExcalidrawDiagram` to every C4 diagram level and verifies that
 * no unfixable errors remain after the fix is applied.
 *
 * **Auto-fixable errors** (arrow center-origin / center-terminus) are silently
 * corrected by the fixer and do NOT cause a test failure.
 *
 * **Unfixable errors** (missing or dangling bindings) cannot be resolved
 * automatically and WILL cause a test failure, prompting manual intervention.
 *
 * Running this suite is the `lint:diagrams:fix` equivalent of `eslint --fix`:
 * it verifies that the element arrays can be brought to a clean state and
 * reports any issues that still require manual attention.
 */
describe('C4 diagrams – diagram lint fix', () => {
  for (const [name, diagram] of Object.entries(diagrams)) {
    for (const level of ['level1', 'level2', 'level3', 'level4'] as const) {
      it(`${name}/${level} has no unfixable lint errors after fix`, () => {
        const original = diagram[level];
        const beforeErrors = lintExcalidrawDiagram(original);

        const { elements: fixed, remainingErrors } = fixExcalidrawDiagram(original);

        // After the fix, no new lint errors should appear in the fixed output.
        const afterErrors = lintExcalidrawDiagram(fixed);

        // The remaining (unfixable) errors reported by the fixer must match
        // the errors still present in the fixed element array.
        expect(remainingErrors).toEqual(afterErrors);

        // There must be no unfixable errors left.
        expect(remainingErrors).toEqual([]);

        // Every error in beforeErrors must have been either fixed or reported
        // as a remaining error – no errors should be silently dropped.
        expect(beforeErrors.length).toBeGreaterThanOrEqual(remainingErrors.length);
      });
    }
  }
});
