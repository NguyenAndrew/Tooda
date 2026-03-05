import type { APIRoute } from 'astro';
import { level3Elements } from '../../../data/excalidraw/level3Elements';

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(level3Elements), {
    headers: { 'Content-Type': 'application/json' },
  });
};
