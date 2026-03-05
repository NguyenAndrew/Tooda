import type { APIRoute } from 'astro';
import { openapiSpec } from '../../data/openapi';

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(openapiSpec), {
    headers: { 'Content-Type': 'application/json' },
  });
};
