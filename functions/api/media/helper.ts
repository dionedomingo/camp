/**
 * Helper to upload a base64 or data-URL image directly to Cloudflare R2 bucket.
 * Returns the public proxy URL (/api/media/selfies/...) or original URL if not base64 or if R2 fails.
 */
export async function saveSelfieToR2(
  bucket: R2Bucket | undefined,
  selfieUrlOrData: string | null | undefined,
  camperIdentifier: string
): Promise<string | null> {
  if (!selfieUrlOrData) return null;
  if (!selfieUrlOrData.startsWith('data:')) {
    // Already an R2 URL or external URL
    return selfieUrlOrData;
  }
  if (!bucket) {
    return selfieUrlOrData;
  }

  try {
    const matches = selfieUrlOrData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return selfieUrlOrData;
    }

    const mimeType = matches[1] || 'image/jpeg';
    const base64Data = matches[2];
    const ext = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg';

    // Decode base64 to Uint8Array
    const binaryStr = atob(base64Data);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    const cleanId = camperIdentifier.replace(/[^a-zA-Z0-9_-]/g, '_');
    const r2Key = `selfies/${cleanId}_${Date.now()}.${ext}`;

    await bucket.put(r2Key, bytes.buffer, {
      httpMetadata: {
        contentType: mimeType,
      },
      customMetadata: {
        camperId: camperIdentifier,
        uploadedAt: new Date().toISOString(),
        type: 'camper_selfie',
      },
    });

    return `/api/media/${r2Key}`;
  } catch (err) {
    console.error('[saveSelfieToR2] Error uploading selfie to R2:', err);
    return selfieUrlOrData; // Fallback to original
  }
}
