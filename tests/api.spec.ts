import { test, expect } from '@playwright/test';

test.describe('Static JSON API – Excalidraw endpoints', () => {
  test('GET /Tooda/api/excalidraw/level1.json returns a JSON array', async ({ request }) => {
    const response = await request.get('/Tooda/api/excalidraw/level1.json');
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('application/json');
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  test('GET /Tooda/api/excalidraw/level2.json returns a JSON array', async ({ request }) => {
    const response = await request.get('/Tooda/api/excalidraw/level2.json');
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('application/json');
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  test('GET /Tooda/api/excalidraw/level3.json returns a JSON array', async ({ request }) => {
    const response = await request.get('/Tooda/api/excalidraw/level3.json');
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('application/json');
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  test('GET /Tooda/api/excalidraw/level4.json returns a JSON array', async ({ request }) => {
    const response = await request.get('/Tooda/api/excalidraw/level4.json');
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('application/json');
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });
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
