import { test, expect } from '@playwright/test';

const excalidrawLevels = ['level1', 'level2', 'level3', 'level4'];

test.describe('Static JSON API – Excalidraw endpoints', () => {
  for (const level of excalidrawLevels) {
    test(`GET /Tooda/api/excalidraw/${level}.json returns a JSON array`, async ({ request }) => {
      const response = await request.get(`/Tooda/api/excalidraw/${level}.json`);
      expect(response.ok()).toBe(true);
      expect(response.headers()['content-type']).toContain('application/json');
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });
  }
});

test.describe('Static JSON API – C4 endpoints', () => {
  test('GET /Tooda/api/c4/banking.json returns a JSON object with expected fields', async ({ request }) => {
    const response = await request.get('/Tooda/api/c4/banking.json');
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('application/json');
    const data = await response.json();
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('description');
    expect(data).toHaveProperty('level1');
    expect(data).toHaveProperty('level2');
    expect(data).toHaveProperty('level3');
    expect(data).toHaveProperty('level4');
    expect(data.title).toBe('Online Banking System');
  });

  test('GET /Tooda/api/c4/ecommerce.json returns a JSON object with expected fields', async ({ request }) => {
    const response = await request.get('/Tooda/api/c4/ecommerce.json');
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('application/json');
    const data = await response.json();
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('description');
    expect(data).toHaveProperty('level1');
    expect(data).toHaveProperty('level2');
    expect(data).toHaveProperty('level3');
    expect(data).toHaveProperty('level4');
    expect(data.title).toBe('E-Commerce Platform');
  });

  test('GET /Tooda/api/c4/ridesharing.json returns a JSON object with expected fields', async ({ request }) => {
    const response = await request.get('/Tooda/api/c4/ridesharing.json');
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('application/json');
    const data = await response.json();
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('description');
    expect(data).toHaveProperty('level1');
    expect(data).toHaveProperty('level2');
    expect(data).toHaveProperty('level3');
    expect(data).toHaveProperty('level4');
    expect(data.title).toBe('Ride-Sharing App');
  });
});

test.describe('Static JSON API – OpenAPI spec endpoint', () => {
  test('GET /Tooda/api/openapi.json returns a JSON object', async ({ request }) => {
    const response = await request.get('/Tooda/api/openapi.json');
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('application/json');
    const data = await response.json();
    expect(data).toHaveProperty('openapi', '3.0.3');
    expect(data).toHaveProperty('info');
    expect(data).toHaveProperty('paths');
    expect(data).toHaveProperty('components');
  });

  test('OpenAPI spec has correct info fields', async ({ request }) => {
    const response = await request.get('/Tooda/api/openapi.json');
    const data = await response.json();
    expect(data.info).toHaveProperty('title', 'Tooda API');
    expect(data.info).toHaveProperty('version', '1.0.0');
  });

  test('OpenAPI spec lists all expected paths', async ({ request }) => {
    const response = await request.get('/Tooda/api/openapi.json');
    const data = await response.json();
    const paths = Object.keys(data.paths);
    expect(paths).toContain('/api/c4/banking.json');
    expect(paths).toContain('/api/c4/ecommerce.json');
    expect(paths).toContain('/api/c4/ridesharing.json');
    expect(paths).toContain('/api/excalidraw/level1.json');
    expect(paths).toContain('/api/excalidraw/level2.json');
    expect(paths).toContain('/api/excalidraw/level3.json');
    expect(paths).toContain('/api/excalidraw/level4.json');
    expect(paths).toContain('/api/openapi.json');
  });

  test('OpenAPI spec defines C4Diagram and ExcalidrawElement schemas', async ({ request }) => {
    const response = await request.get('/Tooda/api/openapi.json');
    const data = await response.json();
    const schemas = data.components.schemas;
    expect(schemas).toHaveProperty('C4Diagram');
    expect(schemas).toHaveProperty('ExcalidrawElement');
    expect(schemas).toHaveProperty('ExcalidrawElementArray');
  });
});

