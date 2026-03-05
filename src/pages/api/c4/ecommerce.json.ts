import type { APIRoute } from 'astro';
import { diagrams } from '../../../data/c4/diagrams';

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(diagrams.ecommerce), {
    headers: { 'Content-Type': 'application/json' },
  });
};
