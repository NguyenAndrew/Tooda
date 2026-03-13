import type { APIRoute } from 'astro';
import { level3Elements } from '../../../data/excalidraw/level3Elements';
import { createJsonResponse } from '../../../utils/apiResponse';

export const GET: APIRoute = () => createJsonResponse(level3Elements);
