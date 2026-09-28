export interface CamperEmailData {
  id: string;
  full_name: string;
  nickname: string;
  email: string;
  phone: string;
  role: string;
  church_id: string;
  church_name?: string;
  church_slug?: string;
  province?: string;
  city?: string;
  dietary_needs?: string;
  emergency_name?: string;
  emergency_phone?: string;
  emergency_relation?: string;
  favorite_verse?: string;
  activation_code: string;
  activation_token?: string;
}

export interface EmailEnv {
  DB: D1Database;
  EMAIL?: {
    send(message: any): Promise<void>;
  };
  EMAIL_SERVICE?: Fetcher;
  RESEND_API_KEY?: string;
  POSTMARK_SERVER_TOKEN?: string;
  EMAIL_FROM?: string;
  CAMP_NAME?: string;
  CAMP_THEME?: string;
  BASE_URL?: string;
}

export interface OutboundEmailPayload {
  to: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SendEmailResult {
  success: boolean;
  provider: 'resend' | 'postmark' | 'cf_email' | 'simulation';
  providerMessageId?: string;
  error?: string;
  idempotentAbort?: boolean;
}
