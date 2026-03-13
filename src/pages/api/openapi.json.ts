import type { APIRoute } from 'astro';
import { openapiSpec } from '../../data/openapi';
import { createJsonResponse } from '../../utils/apiResponse';

export const GET: APIRoute = () => createJsonResponse(openapiSpec);
