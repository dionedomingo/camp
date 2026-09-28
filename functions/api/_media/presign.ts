import { 
  isValidMimeType, 
  isValidFileSize, 
  getExtensionFromMime, 
  MAX_FILE_SIZE_BYTES,
  AllowedMimeType 
} from './validation';

export interface PresignRequest {
  camper_id: string;
  file_name?: string;
  file_type: string;
  file_size: number;
  type?: 'post' | 'story';
}

export interface PresignResult {
  upload_url: string;
  key: string;
  media_url: string;
  file_type: AllowedMimeType;
  file_size: number;
  expires_in: number;
}

export interface PresignEnv {
  MEDIA_BUCKET?: R2Bucket;
  R2_ACCOUNT_ID?: string;
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
  R2_BUCKET_NAME?: string;
  JWT_SECRET?: string;
  PRESIGN_SECRET?: string;
}

const DEFAULT_SECRET = 'vlc-2027-r2-presign-signing-key-secret-safe';

/**
 * Generate HMAC SHA-256 hex signature using Web Crypto API.
 */
async function hmacSha256(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Verify HMAC SHA-256 hex signature.
 */
export async function verifyPresignSignature(
  secret: string,
  key: string,
  mime: string,
  size: number,
  expires: number,
  signature: string
): Promise<boolean> {
  const expected = await hmacSha256(secret, `${key}:${mime}:${size}:${expires}`);
  return expected === signature;
}

/**
 * Service function to validate upload parameters and generate a pre-signed R2 upload URL.
 */
export async function generatePresignedUploadUrl(
  params: PresignRequest,
  env: PresignEnv,
  requestUrl: string
): Promise<PresignResult> {
  const { camper_id, file_type, file_size, type = 'post' } = params;

  if (!camper_id || typeof camper_id !== 'string' || !camper_id.trim()) {
    throw new Error('camper_id is required');
  }

  if (!isValidMimeType(file_type)) {
    throw new Error(`Invalid file type: ${file_type}. Allowed types: image/jpeg, image/png, image/webp`);
  }

  if (!isValidFileSize(file_size)) {
    throw new Error(`Invalid file size. Maximum allowed size is 10MB (${MAX_FILE_SIZE_BYTES} bytes)`);
  }

  const cleanCamperId = camper_id.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const folder = type === 'story' ? 'stories' : 'posts';
  const uuid = crypto.randomUUID();
  const ext = getExtensionFromMime(file_type);

  // Scoped key: campers/{camper_id}/stories/{uuid}.webp or campers/{camper_id}/posts/{uuid}.jpg
  const key = `campers/${cleanCamperId}/${folder}/${uuid}.${ext}`;
  const mediaUrl = `/api/media/${key}`;
  const expiresInSeconds = 3600; // 1 hour validity

  const secret = env.PRESIGN_SECRET || env.JWT_SECRET || DEFAULT_SECRET;
  const expiresTimestamp = Math.floor(Date.now() / 1000) + expiresInSeconds;

  // Check if AWS S3 compatible credentials for Cloudflare R2 are available
  if (env.R2_ACCOUNT_ID && env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY) {
    const bucketName = env.R2_BUCKET_NAME || 'vlc2027-media';
    const s3Url = await generateR2S3PresignedUrl({
      accountId: env.R2_ACCOUNT_ID,
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      bucket: bucketName,
      key,
      mimeType: file_type,
      fileSize: file_size,
      expiresIn: expiresInSeconds,
    });

    return {
      upload_url: s3Url,
      key,
      media_url: mediaUrl,
      file_type: file_type as AllowedMimeType,
      file_size,
      expires_in: expiresInSeconds,
    };
  }

  // Fallback to cryptographic HMAC presigned direct-upload endpoint
  // Works both in Cloudflare Workers / Pages production and local Wrangler miniflare!
  const sig = await hmacSha256(secret, `${key}:${file_type}:${file_size}:${expiresTimestamp}`);
  const baseOrigin = new URL(requestUrl).origin;
  const uploadUrl = `${baseOrigin}/api/media/direct-upload?key=${encodeURIComponent(key)}&mime=${encodeURIComponent(file_type)}&size=${file_size}&expires=${expiresTimestamp}&sig=${sig}`;

  return {
    upload_url: uploadUrl,
    key,
    media_url: mediaUrl,
    file_type: file_type as AllowedMimeType,
    file_size,
    expires_in: expiresInSeconds,
  };
}

/**
 * Generate authentic AWS SigV4 Presigned PUT URL for Cloudflare R2 S3 API
 */
async function generateR2S3PresignedUrl(config: {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  key: string;
  mimeType: string;
  fileSize: number;
  expiresIn: number;
}): Promise<string> {
  const { accountId, accessKeyId, secretAccessKey, bucket, key, mimeType, expiresIn } = config;
  const host = `${accountId}.r2.cloudflarestorage.com`;
  const endpoint = `https://${host}/${bucket}/${encodeURIComponent(key).replace(/%2F/g, '/')}`;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.substring(0, 8);
  const region = 'auto';
  const service = 's3';

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;

  const queryParams = new URLSearchParams({
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': `${accessKeyId}/${credentialScope}`,
    'X-Amz-Date': amzDate,
    'X-Amz-Expires': expiresIn.toString(),
    'X-Amz-SignedHeaders': 'content-type;host',
  });

  const canonicalQueryString = Array.from(queryParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');

  const canonicalHeaders = `content-type:${mimeType}\nhost:${host}\n`;
  const signedHeaders = 'content-type;host';
  const payloadHash = 'UNSIGNED-PAYLOAD';

  const canonicalRequest = [
    'PUT',
    `/${bucket}/${encodeURIComponent(key).replace(/%2F/g, '/')}`,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const canonicalRequestHash = await sha256Hex(canonicalRequest);

  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    canonicalRequestHash,
  ].join('\n');

  const signingKey = await getSignatureKey(secretAccessKey, dateStamp, region, service);
  const signature = await hmacSha256Raw(signingKey, stringToSign);

  return `${endpoint}?${canonicalQueryString}&X-Amz-Signature=${signature}`;
}

async function sha256Hex(msg: string): Promise<string> {
  const enc = new TextEncoder();
  const hash = await crypto.subtle.digest('SHA-256', enc.encode(msg));
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmacSha256Raw(key: CryptoKey, message: string): Promise<string> {
  const enc = new TextEncoder();
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function getSignatureKey(
  key: string,
  dateStamp: string,
  regionName: string,
  serviceName: string
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const kSecret = enc.encode('AWS4' + key);

  const kSecretKey = await crypto.subtle.importKey(
    'raw',
    kSecret,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const kDate = await crypto.subtle.sign('HMAC', kSecretKey, enc.encode(dateStamp));

  const kDateKey = await crypto.subtle.importKey(
    'raw',
    kDate,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const kRegion = await crypto.subtle.sign('HMAC', kDateKey, enc.encode(regionName));

  const kRegionKey = await crypto.subtle.importKey(
    'raw',
    kRegion,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const kService = await crypto.subtle.sign('HMAC', kRegionKey, enc.encode(serviceName));

  const kServiceKey = await crypto.subtle.importKey(
    'raw',
    kService,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const kSigning = await crypto.subtle.sign('HMAC', kServiceKey, enc.encode('aws4_request'));

  return crypto.subtle.importKey(
    'raw',
    kSigning,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
}
