const isDev = import.meta.env.DEV;

export const config = {
  wa_number: import.meta.env.PUBLIC_WA_NUMBER,
  resend_api_key: import.meta.env.RESEND_API_KEY,
  supabase_url: import.meta.env.SUPABASE_URL,
  supabase_anonkey: import.meta.env.SUPABASE_ANON_KEY,
  recaptcha_api_key: import.meta.env.RECAPTCHA_API_KEY,
  recaptpcha_api_key_public: import.meta.env.PUBLIC_RECAPTCHA_API_KEY,
  public_site_url: import.meta.env.PUBLIC_SITE_URL,
  email_receiver: isDev
    ? import.meta.env.DEV_EMAIL_RECEIVER
    : import.meta.env.EMAIL_RECEIVER,
};
