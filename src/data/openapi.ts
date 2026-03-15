export const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Tooda API',
    description:
      'REST API for retrieving architecture and design diagram data used by Tooda. ' +
      'All endpoints return static JSON and are read-only (GET only).',
    version: '1.0.0',
    contact: {
      name: 'Tooda',
      url: 'https://github.com/NguyenAndrew/Tooda',
    },
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
                  level1: [{ id: '...', type: 'rectangle', x: 0, y: 0, width: 200, height: 60 }],
                  level2: [{ id: '...', type: 'rectangle', x: 0, y: 0, width: 200, height: 60 }],
                  level3: [{ id: '...', type: 'rectangle', x: 0, y: 0, width: 200, height: 60 }],
                  level4: [{ id: '...', type: 'rectangle', x: 0, y: 0, width: 200, height: 60 }],
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
                  level1: [{ id: '...', type: 'rectangle', x: 0, y: 0, width: 200, height: 60 }],
                  level2: [{ id: '...', type: 'rectangle', x: 0, y: 0, width: 200, height: 60 }],
                  level3: [{ id: '...', type: 'rectangle', x: 0, y: 0, width: 200, height: 60 }],
                  level4: [{ id: '...', type: 'rectangle', x: 0, y: 0, width: 200, height: 60 }],
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
                  level1: [{ id: '...', type: 'rectangle', x: 0, y: 0, width: 200, height: 60 }],
                  level2: [{ id: '...', type: 'rectangle', x: 0, y: 0, width: 200, height: 60 }],
                  level3: [{ id: '...', type: 'rectangle', x: 0, y: 0, width: 200, height: 60 }],
                  level4: [{ id: '...', type: 'rectangle', x: 0, y: 0, width: 200, height: 60 }],
                },
              },
            },
          },
        },
      },
    },
    '/api/c4/healthcare.json': {
      get: {
        tags: ['C4'],
        summary: 'Healthcare Platform',
        description: 'Returns C4 diagram data for the Healthcare Platform across all four C4 levels.',
        operationId: 'getC4Healthcare',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/C4Diagram' },
                example: {
                  title: 'Healthcare Platform',
                  description:
                    'A Healthcare Platform illustrated across all 4 levels of the C4 model.',
                  level1: [{ id: '...', type: 'rectangle', x: 0, y: 0, width: 200, height: 60 }],
                  level2: [{ id: '...', type: 'rectangle', x: 0, y: 0, width: 200, height: 60 }],
                  level3: [{ id: '...', type: 'rectangle', x: 0, y: 0, width: 200, height: 60 }],
                  level4: [{ id: '...', type: 'rectangle', x: 0, y: 0, width: 200, height: 60 }],
                },
              },
            },
          },
        },
      },
    },
    '/api/openapi.json': {
      get: {
        tags: ['C4'],
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
          'An architecture diagram described across four C4 model levels using Excalidraw elements.',
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
            allOf: [{ $ref: '#/components/schemas/ExcalidrawElementArray' }],
            description:
              'Excalidraw elements for the System Context level.',
          },
          level2: {
            allOf: [{ $ref: '#/components/schemas/ExcalidrawElementArray' }],
            description:
              'Excalidraw elements for the Container level.',
          },
          level3: {
            allOf: [{ $ref: '#/components/schemas/ExcalidrawElementArray' }],
            description:
              'Excalidraw elements for the Component level.',
          },
          level4: {
            allOf: [{ $ref: '#/components/schemas/ExcalidrawElementArray' }],
            description:
              'Excalidraw elements for the Code level.',
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
