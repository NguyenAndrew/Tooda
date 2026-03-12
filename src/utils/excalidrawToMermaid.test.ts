import { describe, it, expect } from 'vitest';
import { extractConnections, excalidrawToMermaid, lintExcalidrawDiagram } from './excalidrawToMermaid';
import type { LevelMeta } from './excalidrawToMermaid';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Build a minimal rectangle element. */
function rect(id: string, x = 0, y = 0, width = 100, height = 50) {
  return { id, type: 'rectangle', x, y, width, height };
}

/** Build a text element attached to a container. */
function textIn(id: string, containerId: string, text: string) {
  return { id, type: 'text', x: 0, y: 0, containerId, text };
}

/** Build a standalone text element with optional fontSize (used as diagram title). */
function title(id: string, text: string, fontSize = 20) {
  return { id, type: 'text', x: 0, y: 0, fontSize, text };
}

/** Build an arrow with both bindings set. */
function arrow(
  id: string,
  fromId: string,
  toId: string,
  points: [number, number][] = [[0, 0], [100, 0]],
) {
  return {
    id,
    type: 'arrow',
    x: 0,
    y: 0,
    points,
    startBinding: { elementId: fromId },
    endBinding: { elementId: toId },
  };
}

/** Build an unbound arrow (no start/end bindings). */
function freeArrow(id: string) {
  return { id, type: 'arrow', x: 0, y: 0, startBinding: null, endBinding: null };
}

// ── extractConnections ────────────────────────────────────────────────────────

describe('extractConnections', () => {
  it('returns an empty array for an empty element list', () => {
    expect(extractConnections([])).toEqual([]);
  });

  it('extracts a single bound arrow', () => {
    const els = [arrow('a1', 'box1', 'box2')];
    expect(extractConnections(els)).toEqual([{ from: 'box1', to: 'box2' }]);
  });

  it('extracts multiple bound arrows', () => {
    const els = [arrow('a1', 'b1', 'b2'), arrow('a2', 'b2', 'b3')];
    expect(extractConnections(els)).toEqual([
      { from: 'b1', to: 'b2' },
      { from: 'b2', to: 'b3' },
    ]);
  });

  it('skips non-arrow elements', () => {
    const els = [rect('r1'), textIn('t1', 'r1', 'Node'), arrow('a1', 'r1', 'r2'), rect('r2')];
    expect(extractConnections(els)).toEqual([{ from: 'r1', to: 'r2' }]);
  });

  it('skips arrows with null startBinding', () => {
    const els = [
      { id: 'a1', type: 'arrow', x: 0, y: 0, startBinding: null, endBinding: { elementId: 'b2' } },
    ];
    expect(extractConnections(els)).toEqual([]);
  });

  it('skips arrows with null endBinding', () => {
    const els = [
      { id: 'a1', type: 'arrow', x: 0, y: 0, startBinding: { elementId: 'b1' }, endBinding: null },
    ];
    expect(extractConnections(els)).toEqual([]);
  });

  it('skips fully unbound arrows', () => {
    const els = [freeArrow('a1')];
    expect(extractConnections(els)).toEqual([]);
  });

  it('skips arrows with undefined startBinding.elementId', () => {
    const els = [
      { id: 'a1', type: 'arrow', x: 0, y: 0, startBinding: { elementId: '' }, endBinding: { elementId: 'b2' } },
    ];
    expect(extractConnections(els)).toEqual([]);
  });
});

// ── excalidrawToMermaid – flowchart ───────────────────────────────────────────

describe('excalidrawToMermaid – flowchart', () => {
  const meta: LevelMeta = { diagramType: 'flowchart' };

  it('produces a minimal flowchart with no nodes or arrows', () => {
    const result = excalidrawToMermaid([], meta);
    expect(result).toBe('flowchart TB\n\n');
  });

  it('emits node declarations for labelled rectangles', () => {
    const els = [
      rect('l1-alpha'),
      textIn('t1', 'l1-alpha', 'Alpha Service\n(Node.js)'),
    ];
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('alpha["Alpha Service"]');
  });

  it('strips trailing tech parenthetical from node names', () => {
    const els = [
      rect('l1-db'),
      textIn('t1', 'l1-db', 'My DB\n(PostgreSQL)'),
    ];
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('db["My DB"]');
  });

  it('uses class-style label (separator line) for node name', () => {
    const els = [
      rect('l1-ctrl'),
      textIn('t1', 'l1-ctrl', 'Controller\n─────────────────\n+doThing()'),
    ];
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('ctrl["Controller"]');
  });

  it('uses ASCII dash separator line for node name', () => {
    const els = [
      rect('l1-svc'),
      textIn('t1', 'l1-svc', 'Service\n---\n+method()'),
    ];
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('svc["Service"]');
  });

  it('replaces double quotes in node names with single quotes', () => {
    const els = [
      rect('l1-n'),
      textIn('t1', 'l1-n', 'Say "Hello"'),
    ];
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain(`n["Say 'Hello'"]`);
  });

  it('emits labelled edges between bound arrows', () => {
    const els = [
      rect('l1-a'),
      textIn('t1', 'l1-a', 'A'),
      rect('l1-b'),
      textIn('t2', 'l1-b', 'B'),
      arrow('arr1', 'l1-a', 'l1-b'),
      textIn('tlabel', 'arr1', 'calls'),
    ];
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('a -- "calls" --> b');
  });

  it('emits unlabelled edges when arrow has no label', () => {
    const els = [
      rect('l1-a'),
      textIn('t1', 'l1-a', 'A'),
      rect('l1-b'),
      textIn('t2', 'l1-b', 'B'),
      arrow('arr1', 'l1-a', 'l1-b'),
    ];
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('a --> b');
    expect(result).not.toContain(' -- "');
  });

  it('replaces double quotes in edge labels with single quotes', () => {
    const els = [
      rect('l1-a'),
      textIn('t1', 'l1-a', 'A'),
      rect('l1-b'),
      textIn('t2', 'l1-b', 'B'),
      arrow('arr1', 'l1-a', 'l1-b'),
      textIn('tlabel', 'arr1', 'say "hi"'),
    ];
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain(`a -- "say 'hi'" --> b`);
  });

  it('skips edges where from-node is not a declared box', () => {
    const els = [
      rect('l1-b'),
      textIn('t2', 'l1-b', 'B'),
      arrow('arr1', 'l1-unknown', 'l1-b'),
    ];
    const result = excalidrawToMermaid(els, meta);
    expect(result).not.toContain('-->');
  });

  it('skips edges where to-node is not a declared box', () => {
    const els = [
      rect('l1-a'),
      textIn('t1', 'l1-a', 'A'),
      arrow('arr1', 'l1-a', 'l1-unknown'),
    ];
    const result = excalidrawToMermaid(els, meta);
    expect(result).not.toContain('-->');
  });

  it('skips rectangles without a label', () => {
    const els = [rect('l1-unlabelled')];
    const result = excalidrawToMermaid(els, meta);
    // Only flowchart header should be present, no node declaration
    expect(result.trim()).toBe('flowchart TB');
  });

  it('collapses newlines in arrow labels', () => {
    const els = [
      rect('l1-a'),
      textIn('t1', 'l1-a', 'A'),
      rect('l1-b'),
      textIn('t2', 'l1-b', 'B'),
      arrow('arr1', 'l1-a', 'l1-b'),
      textIn('tlabel', 'arr1', 'line1\nline2'),
    ];
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('a -- "line1 line2" --> b');
  });

  it('handles labels using originalText fallback', () => {
    const els = [
      rect('l1-a'),
      { id: 't1', type: 'text', x: 0, y: 0, containerId: 'l1-a', originalText: 'NodeA' },
    ];
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('a["NodeA"]');
  });
});

// ── excalidrawToMermaid – classDiagram ────────────────────────────────────────

describe('excalidrawToMermaid – classDiagram', () => {
  const meta: LevelMeta = { diagramType: 'classDiagram' };

  it('produces the class diagram header', () => {
    const result = excalidrawToMermaid([], meta);
    expect(result).toContain('classDiagram');
    expect(result).toContain('direction TB');
  });

  it('emits a class without members', () => {
    const els = [
      rect('l4-controller'),
      textIn('t1', 'l4-controller', 'RecordController'),
    ];
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('class RecordController');
    expect(result).not.toContain('{');
  });

  it('emits a class with members when separator is present', () => {
    const els = [
      rect('l4-ctrl'),
      textIn('t1', 'l4-ctrl', 'RecordController\n─────────────────\n+getRecord(req,res)'),
    ];
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('class RecordController {');
    expect(result).toContain('+getRecord(req,res)');
  });

  it('emits an arrow with a label', () => {
    const els = [
      rect('l4-a'),
      textIn('t1', 'l4-a', 'ClassA'),
      rect('l4-b'),
      textIn('t2', 'l4-b', 'ClassB'),
      arrow('arr1', 'l4-a', 'l4-b'),
      textIn('tlabel', 'arr1', 'uses'),
    ];
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('ClassA --> ClassB : uses');
  });

  it('emits an arrow without a label', () => {
    const els = [
      rect('l4-a'),
      textIn('t1', 'l4-a', 'ClassA'),
      rect('l4-b'),
      textIn('t2', 'l4-b', 'ClassB'),
      arrow('arr1', 'l4-a', 'l4-b'),
    ];
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('ClassA --> ClassB');
    expect(result).not.toContain(' : ');
  });

  it('skips unbound arrows', () => {
    const els = [
      rect('l4-a'),
      textIn('t1', 'l4-a', 'ClassA'),
      freeArrow('arr1'),
    ];
    const result = excalidrawToMermaid(els, meta);
    expect(result).not.toContain('-->');
  });

  it('skips arrows whose startBinding points to unknown element', () => {
    const els = [
      rect('l4-b'),
      textIn('t2', 'l4-b', 'ClassB'),
      arrow('arr1', 'l4-unknown', 'l4-b'),
    ];
    const result = excalidrawToMermaid(els, meta);
    expect(result).not.toContain('-->');
  });

  it('skips arrows whose endBinding points to unknown element', () => {
    const els = [
      rect('l4-a'),
      textIn('t1', 'l4-a', 'ClassA'),
      arrow('arr1', 'l4-a', 'l4-unknown'),
    ];
    const result = excalidrawToMermaid(els, meta);
    expect(result).not.toContain('-->');
  });

  it('collapses newlines in arrow labels', () => {
    const els = [
      rect('l4-a'),
      textIn('t1', 'l4-a', 'ClassA'),
      rect('l4-b'),
      textIn('t2', 'l4-b', 'ClassB'),
      arrow('arr1', 'l4-a', 'l4-b'),
      textIn('tlabel', 'arr1', 'line1\nline2'),
    ];
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('ClassA --> ClassB : line1 line2');
  });
});

// ── excalidrawToMermaid – C4 ──────────────────────────────────────────────────

describe('excalidrawToMermaid – C4Context', () => {
  it('emits the C4Context header and title', () => {
    const titleEl = title('title', 'My System');
    const meta: LevelMeta = {
      diagramType: 'C4Context',
      nodes: {},
    };
    const result = excalidrawToMermaid([titleEl], meta);
    expect(result).toContain('C4Context');
    expect(result).toContain('title My System');
  });

  it('falls back to empty title when no heading element present', () => {
    const meta: LevelMeta = { diagramType: 'C4Context', nodes: {} };
    const result = excalidrawToMermaid([], meta);
    expect(result).toContain('title ');
  });

  it('ignores text elements with small font for title', () => {
    const smallText = { id: 't1', type: 'text', x: 0, y: 0, fontSize: 12, text: 'Small' };
    const meta: LevelMeta = { diagramType: 'C4Context', nodes: {} };
    const result = excalidrawToMermaid([smallText], meta);
    expect(result).toContain('title ');
    // small font text should not be the title
    expect(result).not.toContain('title Small');
  });

  it('uses text with fontSize exactly 18 as title', () => {
    const heading = { id: 't1', type: 'text', x: 0, y: 0, fontSize: 18, text: 'My Title' };
    const meta: LevelMeta = { diagramType: 'C4Context', nodes: {} };
    const result = excalidrawToMermaid([heading], meta);
    expect(result).toContain('title My Title');
  });

  it('emits Person nodes', () => {
    const els = [
      rect('l1-patient'),
      textIn('t1', 'l1-patient', 'Patient'),
    ];
    const meta: LevelMeta = {
      diagramType: 'C4Context',
      nodes: { 'l1-patient': { c4type: 'Person', desc: 'A patient' } },
    };
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('Person(patient, "Patient", "A patient")');
  });

  it('emits System nodes', () => {
    const els = [
      rect('l1-sys'),
      textIn('t1', 'l1-sys', 'Backend System'),
    ];
    const meta: LevelMeta = {
      diagramType: 'C4Context',
      nodes: { 'l1-sys': { c4type: 'System', desc: 'The backend' } },
    };
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('System(sys, "Backend System", "The backend")');
  });

  it('emits System_Ext nodes', () => {
    const els = [
      rect('l1-ext'),
      textIn('t1', 'l1-ext', 'External'),
    ];
    const meta: LevelMeta = {
      diagramType: 'C4Context',
      nodes: { 'l1-ext': { c4type: 'System_Ext', desc: 'External system' } },
    };
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('System_Ext(ext, "External", "External system")');
  });

  it('emits Container nodes with tech from meta', () => {
    const els = [
      rect('l2-webapp'),
      textIn('t1', 'l2-webapp', 'Web App\n(Astro)'),
    ];
    const meta: LevelMeta = {
      diagramType: 'C4Container',
      nodes: { 'l2-webapp': { c4type: 'Container', tech: 'Astro', desc: 'Frontend' } },
    };
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('Container(webapp, "Web App", "Astro", "Frontend")');
  });

  it('falls back to parsed tech when not in meta', () => {
    const els = [
      rect('l2-webapp'),
      textIn('t1', 'l2-webapp', 'Web App\n(Astro)'),
    ];
    const meta: LevelMeta = {
      diagramType: 'C4Container',
      nodes: { 'l2-webapp': { c4type: 'Container', desc: 'Frontend' } },
    };
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('Container(webapp, "Web App", "Astro", "Frontend")');
  });

  it('emits ContainerDb nodes', () => {
    const els = [
      rect('l2-db'),
      textIn('t1', 'l2-db', 'Database\n(PostgreSQL)'),
    ];
    const meta: LevelMeta = {
      diagramType: 'C4Container',
      nodes: { 'l2-db': { c4type: 'ContainerDb', desc: 'Stores records' } },
    };
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('ContainerDb(db, "Database", "PostgreSQL", "Stores records")');
  });

  it('emits Container_Ext nodes', () => {
    const els = [
      rect('l2-extapi'),
      textIn('t1', 'l2-extapi', 'External API\n(REST)'),
    ];
    const meta: LevelMeta = {
      diagramType: 'C4Container',
      nodes: { 'l2-extapi': { c4type: 'Container_Ext', desc: 'Third-party' } },
    };
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('Container_Ext(extapi, "External API", "REST", "Third-party")');
  });

  it('emits ContainerDb_Ext nodes', () => {
    const els = [
      rect('l2-extdb'),
      textIn('t1', 'l2-extdb', 'External DB\n(MySQL)'),
    ];
    const meta: LevelMeta = {
      diagramType: 'C4Container',
      nodes: { 'l2-extdb': { c4type: 'ContainerDb_Ext', desc: 'External store' } },
    };
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('ContainerDb_Ext(extdb, "External DB", "MySQL", "External store")');
  });

  it('emits Component nodes', () => {
    const els = [
      rect('l3-comp'),
      textIn('t1', 'l3-comp', 'Auth Service\n(JWT)'),
    ];
    const meta: LevelMeta = {
      diagramType: 'C4Component',
      nodes: { 'l3-comp': { c4type: 'Component', desc: 'Handles auth' } },
    };
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('Component(comp, "Auth Service", "JWT", "Handles auth")');
  });

  it('skips nodes with no meta entry', () => {
    const els = [
      rect('l1-orphan'),
      textIn('t1', 'l1-orphan', 'Orphan'),
    ];
    const meta: LevelMeta = { diagramType: 'C4Context', nodes: {} };
    const result = excalidrawToMermaid(els, meta);
    expect(result).not.toContain('Orphan');
  });

  it('emits boundaries and nests nodes inside them', () => {
    const els = [
      rect('l2-webapp'),
      textIn('t1', 'l2-webapp', 'Web App'),
    ];
    const meta: LevelMeta = {
      diagramType: 'C4Container',
      nodes: { 'l2-webapp': { c4type: 'Container', tech: 'Astro', desc: 'UI' } },
      boundaries: [
        {
          id: 'hp',
          label: 'Healthcare Platform',
          type: 'System_Boundary',
          nodeIds: ['l2-webapp'],
        },
      ],
    };
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('System_Boundary(hp, "Healthcare Platform") {');
    expect(result).toContain('Container(webapp, "Web App", "Astro", "UI")');
    // Node inside boundary is NOT emitted outside boundary block
    const webappLine = `  Container(webapp`;
    const lines = result.split('\n');
    const outsideLines = lines.filter(l => l === webappLine);
    expect(outsideLines).toHaveLength(0);
  });

  it('emits Enterprise_Boundary type', () => {
    const els = [rect('l1-sys'), textIn('t1', 'l1-sys', 'Sys')];
    const meta: LevelMeta = {
      diagramType: 'C4Context',
      nodes: { 'l1-sys': { c4type: 'System', desc: '' } },
      boundaries: [
        { id: 'eb', label: 'Enterprise', type: 'Enterprise_Boundary', nodeIds: ['l1-sys'] },
      ],
    };
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('Enterprise_Boundary(eb, "Enterprise") {');
  });

  it('emits Container_Boundary type', () => {
    const els = [rect('l3-comp'), textIn('t1', 'l3-comp', 'Comp')];
    const meta: LevelMeta = {
      diagramType: 'C4Component',
      nodes: { 'l3-comp': { c4type: 'Component', desc: '' } },
      boundaries: [
        { id: 'cb', label: 'My Container', type: 'Container_Boundary', nodeIds: ['l3-comp'] },
      ],
    };
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('Container_Boundary(cb, "My Container") {');
  });

  it('emits Rel lines for bound arrows between declared nodes', () => {
    const els = [
      rect('l1-p'),
      textIn('t1', 'l1-p', 'Patient'),
      rect('l1-s'),
      textIn('t2', 'l1-s', 'System'),
      arrow('arr1', 'l1-p', 'l1-s'),
      textIn('tl', 'arr1', 'uses\nservice'),
    ];
    const meta: LevelMeta = {
      diagramType: 'C4Context',
      nodes: {
        'l1-p': { c4type: 'Person', desc: '' },
        'l1-s': { c4type: 'System', desc: '' },
      },
    };
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('Rel(p, s, "uses service")');
  });

  it('skips Rel when from-node has no meta', () => {
    const els = [
      rect('l1-s'),
      textIn('t2', 'l1-s', 'System'),
      arrow('arr1', 'l1-unknown', 'l1-s'),
    ];
    const meta: LevelMeta = {
      diagramType: 'C4Context',
      nodes: { 'l1-s': { c4type: 'System', desc: '' } },
    };
    const result = excalidrawToMermaid(els, meta);
    expect(result).not.toContain('Rel(');
  });

  it('skips Rel when to-node has no meta', () => {
    const els = [
      rect('l1-p'),
      textIn('t1', 'l1-p', 'Patient'),
      arrow('arr1', 'l1-p', 'l1-unknown'),
    ];
    const meta: LevelMeta = {
      diagramType: 'C4Context',
      nodes: { 'l1-p': { c4type: 'Person', desc: '' } },
    };
    const result = excalidrawToMermaid(els, meta);
    expect(result).not.toContain('Rel(');
  });

  it('emits UpdateLayoutConfig when layoutConfig is provided', () => {
    const meta: LevelMeta = {
      diagramType: 'C4Context',
      nodes: {},
      layoutConfig: { c4ShapeInRow: 3, c4BoundaryInRow: 2 },
    };
    const result = excalidrawToMermaid([], meta);
    expect(result).toContain('UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="2")');
  });

  it('uses default values (4, 2) for layoutConfig when properties omitted', () => {
    const meta: LevelMeta = {
      diagramType: 'C4Context',
      nodes: {},
      layoutConfig: {},
    };
    const result = excalidrawToMermaid([], meta);
    expect(result).toContain('UpdateLayoutConfig($c4ShapeInRow="4", $c4BoundaryInRow="2")');
  });

  it('omits UpdateLayoutConfig when useElk is true', () => {
    const meta: LevelMeta = {
      diagramType: 'C4Context',
      nodes: {},
      layoutConfig: { c4ShapeInRow: 3 },
      useElk: true,
    };
    const result = excalidrawToMermaid([], meta);
    expect(result).not.toContain('UpdateLayoutConfig');
  });

  it('prepends ELK init directive when useElk is true', () => {
    const meta: LevelMeta = {
      diagramType: 'C4Context',
      nodes: {},
      useElk: true,
    };
    const result = excalidrawToMermaid([], meta);
    expect(result).toMatch(/^%%\{init: \{"layout": "elk"\}\}%%/);
  });

  it('does not prepend ELK init directive when useElk is false', () => {
    const meta: LevelMeta = { diagramType: 'C4Context', nodes: {}, useElk: false };
    const result = excalidrawToMermaid([], meta);
    expect(result).not.toContain('%%{init');
  });

  it('does not prepend ELK init directive when useElk is omitted', () => {
    const meta: LevelMeta = { diagramType: 'C4Context', nodes: {} };
    const result = excalidrawToMermaid([], meta);
    expect(result).not.toContain('%%{init');
  });

  it('collapses newlines in title text', () => {
    const heading = { id: 't1', type: 'text', x: 0, y: 0, fontSize: 20, text: 'My\nSystem' };
    const meta: LevelMeta = { diagramType: 'C4Context', nodes: {} };
    const result = excalidrawToMermaid([heading], meta);
    expect(result).toContain('title My System');
  });

  it('uses originalText when text field is absent on title element', () => {
    const heading = {
      id: 't1', type: 'text', x: 0, y: 0, fontSize: 20,
      originalText: 'Fallback Title',
    };
    const meta: LevelMeta = { diagramType: 'C4Context', nodes: {} };
    const result = excalidrawToMermaid([heading], meta);
    expect(result).toContain('title Fallback Title');
  });

  it('uses originalText fallback for container labels', () => {
    const els = [
      rect('l1-sys'),
      { id: 't1', type: 'text', x: 0, y: 0, containerId: 'l1-sys', originalText: 'My System' },
    ];
    const meta: LevelMeta = {
      diagramType: 'C4Context',
      nodes: { 'l1-sys': { c4type: 'System', desc: '' } },
    };
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('System(sys, "My System", "")');
  });

  it('handles empty desc gracefully', () => {
    const els = [rect('l1-sys'), textIn('t1', 'l1-sys', 'My System')];
    const meta: LevelMeta = {
      diagramType: 'C4Context',
      nodes: { 'l1-sys': { c4type: 'System' } },
    };
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('System(sys, "My System", "")');
  });

  it('strips level prefix with multiple digits', () => {
    const els = [rect('l10-node'), textIn('t1', 'l10-node', 'Node')];
    const meta: LevelMeta = {
      diagramType: 'C4Context',
      nodes: { 'l10-node': { c4type: 'System', desc: '' } },
    };
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('System(node, "Node", "")');
  });

  it('converts hyphens in id to underscores', () => {
    const els = [rect('l1-my-node'), textIn('t1', 'l1-my-node', 'My Node')];
    const meta: LevelMeta = {
      diagramType: 'C4Context',
      nodes: { 'l1-my-node': { c4type: 'System', desc: '' } },
    };
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('System(my_node, "My Node", "")');
  });

  // ── Additional branch coverage ────────────────────────────────────────────

  it('stores empty string when text element has neither text nor originalText', () => {
    // Covers the final `?? ''` branch in labelByContainer building (C4)
    const els = [
      rect('l1-sys'),
      // element with type 'text' and containerId but no text/originalText fields
      { id: 't1', type: 'text', x: 0, y: 0, containerId: 'l1-sys' },
    ];
    const meta: LevelMeta = {
      diagramType: 'C4Context',
      nodes: { 'l1-sys': { c4type: 'System', desc: 'empty label' } },
    };
    const result = excalidrawToMermaid(els, meta);
    // The node label will be empty string parsed as name: ''
    expect(result).toContain('System(sys, "", "empty label")');
  });

  it('node in nodeMeta with no text element falls back to empty label', () => {
    // Covers `labelByContainer[id] ?? ''` when node has meta but no text child
    const els = [
      rect('l1-sys'),
      // No text element for l1-sys → labelByContainer['l1-sys'] is undefined
    ];
    const meta: LevelMeta = {
      diagramType: 'C4Context',
      nodes: { 'l1-sys': { c4type: 'System', desc: 'no label' } },
    };
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('System(sys, "", "no label")');
  });

  it('standalone text element without fontSize is skipped for title', () => {
    // Covers the `el.fontSize ?? 0` branch when fontSize is undefined → returns 0 → < 18
    const noFontText = { id: 't1', type: 'text', x: 0, y: 0, text: 'Not a title' };
    const meta: LevelMeta = { diagramType: 'C4Context', nodes: {} };
    const result = excalidrawToMermaid([noFontText], meta);
    expect(result).not.toContain('title Not a title');
    expect(result).toContain('title ');
  });

  it('title element with no text and no originalText falls back to empty string', () => {
    // Covers titleEl.text ?? titleEl.originalText ?? '' when both are absent
    const heading = { id: 't1', type: 'text', x: 0, y: 0, fontSize: 20 };
    const meta: LevelMeta = { diagramType: 'C4Context', nodes: {} };
    const result = excalidrawToMermaid([heading], meta);
    expect(result).toContain('title ');
  });

  it('handles meta without nodes property (meta.nodes ?? {} branch)', () => {
    // Covers `meta.nodes ?? {}` when nodes is not provided
    const meta: LevelMeta = { diagramType: 'C4Context' };
    const result = excalidrawToMermaid([], meta);
    expect(result).toContain('C4Context');
  });

  it('does not declare a node twice when it appears in multiple boundaries', () => {
    // Covers the `declaredNodes.has(id)` early return in declareNode
    const els = [rect('l2-webapp'), textIn('t1', 'l2-webapp', 'Web App')];
    const meta: LevelMeta = {
      diagramType: 'C4Container',
      nodes: { 'l2-webapp': { c4type: 'Container', tech: 'Astro', desc: 'UI' } },
      boundaries: [
        { id: 'b1', label: 'Boundary 1', type: 'System_Boundary', nodeIds: ['l2-webapp'] },
        { id: 'b2', label: 'Boundary 2', type: 'System_Boundary', nodeIds: ['l2-webapp'] },
      ],
    };
    const result = excalidrawToMermaid(els, meta);
    // webapp should appear exactly once despite being listed in two boundaries
    const occurrences = (result.match(/Container\(webapp/g) ?? []).length;
    expect(occurrences).toBe(1);
  });

  it('skips boundary node that has no nodeMeta entry', () => {
    // Covers the `!nm` early return in declareNode when boundary lists unknown node
    const meta: LevelMeta = {
      diagramType: 'C4Container',
      nodes: {},
      boundaries: [
        { id: 'b1', label: 'B1', type: 'System_Boundary', nodeIds: ['l2-unknown'] },
      ],
    };
    const result = excalidrawToMermaid([], meta);
    expect(result).not.toContain('l2-unknown');
  });

  it('emits Rel with empty label when arrow has no label text', () => {
    // Covers `labelByContainer[arrow.id] ?? ''` when arrow id not in labelByContainer
    const els = [
      rect('l1-p'),
      textIn('t1', 'l1-p', 'Patient'),
      rect('l1-s'),
      textIn('t2', 'l1-s', 'System'),
      arrow('arr1', 'l1-p', 'l1-s'),
      // No label element for arr1
    ];
    const meta: LevelMeta = {
      diagramType: 'C4Context',
      nodes: {
        'l1-p': { c4type: 'Person', desc: '' },
        'l1-s': { c4type: 'System', desc: '' },
      },
    };
    const result = excalidrawToMermaid(els, meta);
    expect(result).toContain('Rel(p, s, "")');
  });
});

describe('excalidrawToMermaid – classDiagram additional branches', () => {
  const meta: LevelMeta = { diagramType: 'classDiagram' };

  it('stores empty string when text element has neither text nor originalText', () => {
    // Covers the final `?? ''` branch in labelByContainer building (classDiagram)
    const els = [
      rect('l4-ctrl'),
      // Text element without text or originalText
      { id: 't1', type: 'text', x: 0, y: 0, containerId: 'l4-ctrl' },
    ];
    // labelByContainer['l4-ctrl'] will be '' → classBoxes filter excludes it (falsy)
    const result = excalidrawToMermaid(els, meta);
    // No class should be emitted since the label is empty (falsy)
    expect(result).not.toContain('class ');
  });
});

describe('excalidrawToMermaid – flowchart additional branches', () => {
  const meta: LevelMeta = { diagramType: 'flowchart' };

  it('stores empty string when text element has neither text nor originalText', () => {
    // Covers the final `?? ''` branch in labelByContainer building (flowchart)
    const els = [
      rect('l1-n'),
      // Text element without text or originalText
      { id: 't1', type: 'text', x: 0, y: 0, containerId: 'l1-n' },
    ];
    // labelByContainer['l1-n'] will be '' → nodeBoxes filter excludes it (falsy)
    const result = excalidrawToMermaid(els, meta);
    // No node declaration should be emitted
    expect(result).not.toContain('n["');
  });
});

// ── lintExcalidrawDiagram ─────────────────────────────────────────────────────

describe('lintExcalidrawDiagram', () => {
  it('returns no errors for an empty element list', () => {
    expect(lintExcalidrawDiagram([])).toEqual([]);
  });

  it('returns no errors when all arrows are fully bound', () => {
    const els = [
      rect('b1'),
      rect('b2'),
      arrow('a1', 'b1', 'b2'),
    ];
    expect(lintExcalidrawDiagram(els)).toEqual([]);
  });

  it('ignores non-arrow elements', () => {
    const els = [rect('r1'), textIn('t1', 'r1', 'Node')];
    expect(lintExcalidrawDiagram(els)).toEqual([]);
  });

  it('reports an error when startBinding is null', () => {
    const els = [
      rect('b1'),
      { id: 'a1', type: 'arrow', x: 0, y: 0, startBinding: null, endBinding: { elementId: 'b1' } },
    ];
    const errors = lintExcalidrawDiagram(els);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual({ elementId: 'a1', message: 'Arrow is missing startBinding' });
  });

  it('reports an error when endBinding is null', () => {
    const els = [
      rect('b1'),
      { id: 'a1', type: 'arrow', x: 0, y: 0, startBinding: { elementId: 'b1' }, endBinding: null },
    ];
    const errors = lintExcalidrawDiagram(els);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual({ elementId: 'a1', message: 'Arrow is missing endBinding' });
  });

  it('reports an error when startBinding.elementId is empty string', () => {
    const els = [
      rect('b1'),
      { id: 'a1', type: 'arrow', x: 0, y: 0, startBinding: { elementId: '' }, endBinding: { elementId: 'b1' } },
    ];
    const errors = lintExcalidrawDiagram(els);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual({ elementId: 'a1', message: 'Arrow is missing startBinding' });
  });

  it('reports an error when startBinding references an unknown element', () => {
    const els = [
      rect('b1'),
      arrow('a1', 'missing-id', 'b1'),
    ];
    const errors = lintExcalidrawDiagram(els);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual({
      elementId: 'a1',
      message: 'Arrow startBinding references unknown element "missing-id"',
    });
  });

  it('reports an error when endBinding references an unknown element', () => {
    const els = [
      rect('b1'),
      arrow('a1', 'b1', 'missing-id'),
    ];
    const errors = lintExcalidrawDiagram(els);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual({
      elementId: 'a1',
      message: 'Arrow endBinding references unknown element "missing-id"',
    });
  });

  it('reports two errors for a fully unbound arrow', () => {
    const els = [freeArrow('a1')];
    const errors = lintExcalidrawDiagram(els);
    expect(errors).toHaveLength(2);
    expect(errors[0]).toEqual({ elementId: 'a1', message: 'Arrow is missing startBinding' });
    expect(errors[1]).toEqual({ elementId: 'a1', message: 'Arrow is missing endBinding' });
  });

  it('reports errors for multiple arrows', () => {
    const els = [
      rect('b1'),
      rect('b2'),
      arrow('a1', 'b1', 'b2'),        // valid
      freeArrow('a2'),                 // both bindings missing
      arrow('a3', 'ghost', 'b2'),     // unknown start
    ];
    const errors = lintExcalidrawDiagram(els);
    // a2: missing start + end; a3: unknown start
    expect(errors).toHaveLength(3);
  });
});
