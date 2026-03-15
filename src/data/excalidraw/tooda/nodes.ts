import type { DiagramNode } from '../healthcare/nodes';

export const LEVEL_NODES: Record<number, DiagramNode[]> = {
  1: [
    { label: 'Developer / Architect', icon: '🧑‍💻', color: 0x3b82f6, description: 'Browses and creates architecture diagrams.',                           excalidrawId: 'l1-developer'   },
    { label: 'Tooda',                 icon: '✏️',   color: 0x22c55e, description: 'A browser-based architecture diagramming tool.',                       excalidrawId: 'l1-tooda'       },
    { label: 'GitHub Pages',          icon: '🌐',   color: 0x64748b, description: 'Hosts and serves the static Tooda web app.',                           excalidrawId: 'l1-githubPages' },
    { label: 'Mermaid',               icon: '🧜',   color: 0x64748b, description: 'Renders C4 diagrams as SVGs in the browser.',                          excalidrawId: 'l1-mermaid'     },
    { label: 'Excalidraw',            icon: '🎨',   color: 0x64748b, description: 'Renders freehand architecture sketches in the browser.',               excalidrawId: 'l1-excalidraw'  },
  ],
  2: [
    { label: 'Developer / Architect', icon: '🧑‍💻', color: 0x3b82f6, description: 'Browses and creates architecture diagrams.',                           excalidrawId: 'l2-developer'      },
    { label: 'GitHub Pages',          icon: '🌐',   color: 0x64748b, description: 'Hosts and serves the static Tooda web app.',                           excalidrawId: 'l2-githubPages'    },
    { label: 'Static Web App',        icon: '✏️',   color: 0x8b5cf6, description: 'The Tooda Astro static site with all viewers.',                        excalidrawId: 'l2-webApp'         },
    { label: 'C4 Viewer',             icon: '📐',   color: 0x8b5cf6, description: 'Displays C4 diagrams rendered by Mermaid.',                            excalidrawId: 'l2-c4Page'         },
    { label: 'Excalidraw Viewer',     icon: '🎨',   color: 0x8b5cf6, description: 'Displays freehand Excalidraw diagrams.',                               excalidrawId: 'l2-excalidrawPage' },
    { label: 'API Explorer',          icon: '🔍',   color: 0x8b5cf6, description: 'Lets users browse the Tooda OpenAPI specification.',                   excalidrawId: 'l2-apiPage'        },
    { label: 'Mermaid Library',       icon: '🧜',   color: 0x64748b, description: 'Client-side library for rendering Mermaid diagrams.',                  excalidrawId: 'l2-mermaidLib'     },
    { label: 'Excalidraw Library',    icon: '🎨',   color: 0x64748b, description: 'Client-side library for rendering Excalidraw sketches.',               excalidrawId: 'l2-excalidrawLib'  },
  ],
  3: [
    { label: 'Developer / Architect', icon: '🧑‍💻', color: 0x64748b, description: 'Interacts with the C4 Viewer.',                                        excalidrawId: 'l3-developer'          },
    { label: 'Node Drag Controller',  icon: '🖱️',   color: 0x0ea5e9, description: 'Handles drag-to-reposition nodes in the diagram.',                    excalidrawId: 'l3-nodeDragController'  },
    { label: 'Diagram Data',          icon: '📦',   color: 0x0ea5e9, description: 'Holds the source Mermaid strings for all diagrams.',                   excalidrawId: 'l3-diagramData'         },
    { label: 'Tab Controller',        icon: '🗂️',   color: 0x0ea5e9, description: 'Manages switching between C4 level tabs.',                             excalidrawId: 'l3-tabController'       },
    { label: 'Example Switcher',      icon: '🔄',   color: 0x0ea5e9, description: 'Switches between diagram examples (banking, e-commerce, etc.).',      excalidrawId: 'l3-exampleSwitcher'     },
    { label: 'View Toggle',           icon: '👁️',   color: 0x0ea5e9, description: 'Toggles between Excalidraw and Mermaid renderer.',                    excalidrawId: 'l3-viewToggle'          },
    { label: 'Mermaid Renderer',      icon: '🧜',   color: 0x0ea5e9, description: 'Renders Mermaid diagram strings into SVG.',                            excalidrawId: 'l3-mermaidRenderer'     },
    { label: 'Pan/Zoom Controller',   icon: '🔍',   color: 0x0ea5e9, description: 'Handles pan and zoom on the rendered diagram.',                        excalidrawId: 'l3-panZoomController'   },
    { label: 'Mermaid Library',       icon: '📚',   color: 0x64748b, description: 'Client-side library for rendering Mermaid diagrams.',                  excalidrawId: 'l3-mermaidLib'          },
  ],
  4: [
    { label: 'DiagramEntry',      icon: '📄', color: 0x3b82f6, description: 'Represents a single diagram with title, description, and all 4 level strings.', excalidrawId: 'l4-entry'      },
    { label: 'DiagramCollection', icon: '📚', color: 0x22c55e, description: 'Groups all diagram examples (banking, ecommerce, ridesharing, tooda).',         excalidrawId: 'l4-collection' },
    { label: 'Logger',            icon: '📝', color: 0xf59e0b, description: 'Prefixed logger used throughout Tooda for debug, info, warn, and error output.', excalidrawId: 'l4-logger'     },
    { label: 'MermaidConfig',     icon: '⚙️', color: 0xa855f7, description: 'Configuration object for the Mermaid library initialization.',                  excalidrawId: 'l4-config'     },
  ],
};
