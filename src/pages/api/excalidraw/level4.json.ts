import type { APIRoute } from 'astro';
import { level4Elements } from '../../../data/excalidraw/level4Elements';

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(level4Elements), {
    headers: { 'Content-Type': 'application/json' },
  });
};
