import type { APIRoute } from 'astro';
import { level2Elements } from '../../../data/excalidraw/level2Elements';
import { createJsonResponse } from '../../../utils/apiResponse';

export const GET: APIRoute = () => createJsonResponse(level2Elements);
