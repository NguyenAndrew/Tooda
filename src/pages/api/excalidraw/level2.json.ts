import type { APIRoute } from 'astro';
import { level2Elements } from '../../../data/excalidraw/level2Elements';

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(level2Elements), {
    headers: { 'Content-Type': 'application/json' },
  });
};
