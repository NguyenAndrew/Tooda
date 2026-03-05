export const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Tooda API',
    description:
      'REST API for retrieving architecture and design diagram data used by Tooda. ' +
      'All endpoints return static JSON and are read-only (GET only).',
    version: '1.0.0',
    license: {
      name: 'MIT',
      url: 'https://github.com/NguyenAndrew/Tooda/blob/main/LICENSE',
    },
  },
  servers: [
    {
      url: 'https://nguyenandrew.github.io/Tooda',
      description: 'Production (GitHub Pages)',
    },
  ],
  tags: [
    {
      name: 'C4',
      description:
        'C4 model diagram data for architecture examples. Each endpoint returns ' +
        'an object containing diagram definitions for all four C4 levels.',
    },
    {
      name: 'Excalidraw',
      description:
        'Excalidraw element arrays for the Healthcare Platform example, ' +
        'split across four C4 levels.',
    },
  ],
  paths: {
    '/api/c4/banking.json': {
      get: {
        tags: ['C4'],
        summary: 'Online Banking System',
        description: 'Returns C4 diagram data for the Online Banking System across all four C4 levels.',
        operationId: 'getC4Banking',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/C4Diagram' },
                example: {
                  title: 'Online Banking System',
                  description:
                    'An Online Banking System illustrated across all 4 levels of the C4 model.',
                  level1: 'C4Context\n  title System Context – Online Banking System\n  ...',
                  level2: 'C4Container\n  title Container – Online Banking System\n  ...',
                  level3: 'C4Component\n  title Component – API Application\n  ...',
                  level4: 'classDiagram\n  direction TB\n  ...',
                },
              },
            },
          },
        },
      },
    },
    '/api/c4/ecommerce.json': {
      get: {
        tags: ['C4'],
        summary: 'E-Commerce Platform',
        description: 'Returns C4 diagram data for the E-Commerce Platform across all four C4 levels.',
        operationId: 'getC4Ecommerce',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/C4Diagram' },
                example: {
                  title: 'E-Commerce Platform',
                  description:
                    'An E-Commerce Platform illustrated across all 4 levels of the C4 model.',
                  level1: 'C4Context\n  title System Context – E-Commerce Platform\n  ...',
                  level2: 'C4Container\n  title Container – E-Commerce Platform\n  ...',
                  level3: 'C4Component\n  title Component – Order Service\n  ...',
                  level4: 'classDiagram\n  direction TB\n  ...',
                },
              },
            },
          },
        },
      },
    },
    '/api/c4/ridesharing.json': {
      get: {
        tags: ['C4'],
        summary: 'Ride-Sharing App',
        description: 'Returns C4 diagram data for the Ride-Sharing App across all four C4 levels.',
        operationId: 'getC4Ridesharing',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/C4Diagram' },
                example: {
                  title: 'Ride-Sharing App',
                  description:
                    'A Ride-Sharing App illustrated across all 4 levels of the C4 model.',
                  level1: 'C4Context\n  title System Context – Ride-Sharing App\n  ...',
                  level2: 'C4Container\n  title Container – Ride-Sharing App\n  ...',
                  level3: 'C4Component\n  title Component – API Server\n  ...',
                  level4: 'classDiagram\n  direction TB\n  ...',
                },
              },
            },
          },
        },
      },
    },
    '/api/excalidraw/level1.json': {
      get: {
        tags: ['Excalidraw'],
        summary: 'Healthcare Platform – Level 1 (Context)',
        description:
          'Returns an array of Excalidraw elements representing the Level 1 (System Context) diagram for the Healthcare Platform.',
        operationId: 'getExcalidrawLevel1',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ExcalidrawElementArray' },
              },
            },
          },
        },
      },
    },
    '/api/excalidraw/level2.json': {
      get: {
        tags: ['Excalidraw'],
        summary: 'Healthcare Platform – Level 2 (Container)',
        description:
          'Returns an array of Excalidraw elements representing the Level 2 (Container) diagram for the Healthcare Platform.',
        operationId: 'getExcalidrawLevel2',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ExcalidrawElementArray' },
              },
            },
          },
        },
      },
    },
    '/api/excalidraw/level3.json': {
      get: {
        tags: ['Excalidraw'],
        summary: 'Healthcare Platform – Level 3 (Component)',
        description:
          'Returns an array of Excalidraw elements representing the Level 3 (Component) diagram for the Healthcare Platform.',
        operationId: 'getExcalidrawLevel3',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ExcalidrawElementArray' },
              },
            },
          },
        },
      },
    },
    '/api/excalidraw/level4.json': {
      get: {
        tags: ['Excalidraw'],
        summary: 'Healthcare Platform – Level 4 (Code)',
        description:
          'Returns an array of Excalidraw elements representing the Level 4 (Code) diagram for the Healthcare Platform.',
        operationId: 'getExcalidrawLevel4',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ExcalidrawElementArray' },
              },
            },
          },
        },
      },
    },
    '/api/openapi.json': {
      get: {
        tags: ['C4', 'Excalidraw'],
        summary: 'OpenAPI specification',
        description: 'Returns this OpenAPI 3.0 specification document.',
        operationId: 'getOpenApiSpec',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { type: 'object' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      C4Diagram: {
        type: 'object',
        description:
          'An architecture diagram described across four C4 model levels using Mermaid syntax.',
        required: ['title', 'description', 'level1', 'level2', 'level3', 'level4'],
        properties: {
          title: {
            type: 'string',
            description: 'Human-readable name of the system or platform.',
            example: 'Online Banking System',
          },
          description: {
            type: 'string',
            description: 'Short description of the system.',
            example:
              'An Online Banking System illustrated across all 4 levels of the C4 model.',
          },
          level1: {
            type: 'string',
            description:
              'Mermaid C4Context diagram source (System Context level).',
          },
          level2: {
            type: 'string',
            description:
              'Mermaid C4Container diagram source (Container level).',
          },
          level3: {
            type: 'string',
            description:
              'Mermaid C4Component diagram source (Component level).',
          },
          level4: {
            type: 'string',
            description:
              'Mermaid class diagram source (Code level).',
          },
        },
      },
      ExcalidrawElement: {
        type: 'object',
        description: 'A single element in an Excalidraw drawing.',
        required: ['id', 'type', 'x', 'y', 'width', 'height'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the element.',
          },
          type: {
            type: 'string',
            description: 'Element type (e.g. "rectangle", "text", "arrow").',
            example: 'rectangle',
          },
          x: {
            type: 'number',
            description: 'Horizontal position on the canvas.',
          },
          y: {
            type: 'number',
            description: 'Vertical position on the canvas.',
          },
          width: {
            type: 'number',
            description: 'Width of the element.',
          },
          height: {
            type: 'number',
            description: 'Height of the element.',
          },
          angle: {
            type: 'number',
            description: 'Rotation angle in radians.',
          },
          strokeColor: {
            type: 'string',
            description: 'CSS color string for the stroke.',
          },
          backgroundColor: {
            type: 'string',
            description: 'CSS color string for the fill.',
          },
          fillStyle: {
            type: 'string',
            description: 'Fill style (e.g. "solid", "hachure").',
          },
          strokeWidth: {
            type: 'number',
            description: 'Stroke width in pixels.',
          },
          strokeStyle: {
            type: 'string',
            description: 'Stroke style (e.g. "solid", "dashed").',
          },
          roughness: {
            type: 'number',
            description: 'Roughness level of the sketch effect.',
          },
          opacity: {
            type: 'number',
            description: 'Opacity from 0 to 100.',
          },
          isDeleted: {
            type: 'boolean',
            description: 'Whether the element has been soft-deleted.',
          },
          text: {
            type: 'string',
            description: 'Text content (only present on text elements).',
          },
        },
      },
      ExcalidrawElementArray: {
        type: 'array',
        description: 'An ordered list of Excalidraw elements that compose a diagram.',
        items: { $ref: '#/components/schemas/ExcalidrawElement' },
      },
    },
  },
};
