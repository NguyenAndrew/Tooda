import type { APIRoute } from 'astro';
import { level4Elements } from '../../../data/excalidraw/level4Elements';
import { createJsonResponse } from '../../../utils/apiResponse';

export const GET: APIRoute = () => createJsonResponse(level4Elements);
