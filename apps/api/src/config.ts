import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(5174),
  HOST: z.string().min(1).default('127.0.0.1'),
  API_JWT_SECRET: z.string().min(1).default('dev-secret-change-me'),
  USE_SUPABASE_DB: z
    .string()
    .optional()
    .transform((v) => String(v ?? '').toLowerCase() === 'true'),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().min(1).optional(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  SUPABASE_DEFAULT_ORG_ID: z.string().uuid().default('11111111-1111-1111-1111-111111111111'),
});

export type AppConfig = {
  nodeEnv: 'development' | 'production' | 'test';
  port: number;
  host: string;
  apiJwtSecret: string;
  useSupabaseDb: boolean;
  supabaseUrl: string | undefined;
  supabaseAnonKey: string | undefined;
  supabaseServiceRoleKey: string | undefined;
  supabaseDefaultOrgId: string;
};

let cached: AppConfig | null = null;

function toAppConfig(parsed: z.infer<typeof envSchema>): AppConfig {
  return {
    nodeEnv: parsed.NODE_ENV,
    port: parsed.PORT,
    host: parsed.HOST,
    apiJwtSecret: parsed.API_JWT_SECRET,
    useSupabaseDb: parsed.USE_SUPABASE_DB,
    supabaseUrl: parsed.SUPABASE_URL,
    supabaseAnonKey: parsed.SUPABASE_ANON_KEY ?? parsed.VITE_SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: parsed.SUPABASE_SERVICE_ROLE_KEY,
    supabaseDefaultOrgId: parsed.SUPABASE_DEFAULT_ORG_ID,
  };
}

export function loadConfig(): AppConfig {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
    throw new Error(`Invalid environment: ${msg}`);
  }

  const data = parsed.data;
  if (data.USE_SUPABASE_DB) {
    if (!data.SUPABASE_URL || !data.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('USE_SUPABASE_DB=true requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    }
    if (!(data.SUPABASE_ANON_KEY ?? data.VITE_SUPABASE_ANON_KEY)) {
      throw new Error('USE_SUPABASE_DB=true requires SUPABASE_ANON_KEY or VITE_SUPABASE_ANON_KEY');
    }
  }

  if (data.NODE_ENV === 'production') {
    if (data.API_JWT_SECRET === 'dev-secret-change-me') {
      throw new Error('API_JWT_SECRET must be set to a strong secret in production');
    }
  }

  cached = toAppConfig(data);
  return cached;
}

export function getConfig(): AppConfig {
  if (!cached) return loadConfig();
  return cached;
}
