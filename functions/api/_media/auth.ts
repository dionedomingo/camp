/**
 * Helper to extract camper_id from request headers, query string, or optional payload.
 */
export function extractCamperId(request: Request, body?: { camper_id?: string; camperId?: string }): string | null {
  // 1. Explicit header x-camper-id
  const headerId = request.headers.get('x-camper-id');
  if (headerId && headerId.trim()) {
    return headerId.trim();
  }

  // 2. Authorization header (Bearer cmp_...)
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token) return token;
  }

  // 3. Request URL query param (?camper_id=... or ?viewer_id=...)
  try {
    const url = new URL(request.url);
    const queryId = url.searchParams.get('camper_id') || url.searchParams.get('viewer_id') || url.searchParams.get('auth_camper_id');
    if (queryId && queryId.trim()) {
      return queryId.trim();
    }
  } catch {
    // Ignore URL parse error
  }

  // 4. Request body payload
  if (body) {
    const bodyId = body.camper_id || body.camperId;
    if (bodyId && typeof bodyId === 'string' && bodyId.trim()) {
      return bodyId.trim();
    }
  }

  return null;
}
