import type { APIRoute } from 'astro';
import { level1Elements } from '../../../data/excalidraw/level1Elements';

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(level1Elements), {
    headers: { 'Content-Type': 'application/json' },
  });
};
