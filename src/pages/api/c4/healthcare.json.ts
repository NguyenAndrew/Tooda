import type { APIRoute } from 'astro';
import { diagrams } from '../../../data/c4/diagrams';
import { createJsonResponse } from '../../../utils/apiResponse';

export const GET: APIRoute = () => createJsonResponse(diagrams.healthcare);
