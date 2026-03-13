import type { APIRoute } from 'astro';
import { level1Elements } from '../../../data/excalidraw/level1Elements';
import { createJsonResponse } from '../../../utils/apiResponse';

export const GET: APIRoute = () => createJsonResponse(level1Elements);
