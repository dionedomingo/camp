import QRCode from 'qrcode';

export interface QRCodeResult {
  dataUrl: string;
  activationUrl: string;
}

/**
 * Generates an edge-compatible Base64 PNG Data URI for the camper pass QR code.
 * Color scheme matches VLC 2027 brand deep navy/blue (#0f172a or #1e3a8a).
 */
export async function generateCamperQRCode(
  activationCode: string,
  activationToken: string | undefined,
  baseUrl: string = 'https://camp.pcciministries.com'
): Promise<QRCodeResult> {
  const cleanBase = baseUrl.replace(/\/$/, '');
  const tokenParam = activationToken ? `&activate_token=${encodeURIComponent(activationToken)}` : '';
  const activationUrl = `${cleanBase}/?code=${encodeURIComponent(activationCode)}${tokenParam}`;

  try {
    const dataUrl = await QRCode.toDataURL(activationUrl, {
      width: 240,
      margin: 1,
      color: {
        dark: '#1e3a8a', // Deep Blue
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });

    return { dataUrl, activationUrl };
  } catch (err) {
    console.error('[QR Generation Error]', err);
    // Return empty string on unexpected failure so template still renders pass code
    return { dataUrl: '', activationUrl };
  }
}
