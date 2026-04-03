import { createClient } from '@libsql/client';
import 'dotenv/config';

const isDev = import.meta.env?.DEV ?? process.env.NODE_ENV !== 'production';
const url = import.meta.env?.TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL;
const authToken = import.meta.env?.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;

// Conectar a Turso directamente usando las variables de entorno
export const turso = createClient({
  url: url as string,
  authToken: authToken as string,
});

export const devClient = createClient({
  url: 'http://127.0.0.1:8080',
});

// Use the remote Turso DB directly
export const db = turso;
