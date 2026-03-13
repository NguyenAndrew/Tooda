/**
 * Creates a JSON HTTP response with the standard `application/json`
 * Content-Type header.
 *
 * Extracted to eliminate the identical boilerplate that previously appeared
 * in every API route handler.
 */
export function createJsonResponse(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}
