import { createClient } from '@libsql/client';
import 'dotenv/config';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": undefined, "SSR": true};
const isDev = Object.assign(__vite_import_meta_env__, { TURSO_DATABASE_URL: "libsql://appmedica-disloyalcobra.aws-us-east-1.turso.io", TURSO_AUTH_TOKEN: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzMyOTE0NzMsImlkIjoiMDE5Y2UwNjUtYjYwMS03NmNlLTliZTQtMzJkZmMyZjhlMmI1IiwicmlkIjoiZGJiYjNlMzctZTU3OS00OGE3LTg0YjktZWQyODE5Mzk1MjJlIn0.ubWoOnXsnIfJw59aAtqe8SVBkMZCKKXfQRFrtWO70qzQYU5tNx5MqrsZgtsMrbt4FqrB6G12tnwf925YzX69CQ", NODE: process.env.NODE, NODE_ENV: process.env.NODE_ENV })?.DEV ?? process.env.NODE_ENV !== "production";
const url = "libsql://appmedica-disloyalcobra.aws-us-east-1.turso.io";
const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzMyOTE0NzMsImlkIjoiMDE5Y2UwNjUtYjYwMS03NmNlLTliZTQtMzJkZmMyZjhlMmI1IiwicmlkIjoiZGJiYjNlMzctZTU3OS00OGE3LTg0YjktZWQyODE5Mzk1MjJlIn0.ubWoOnXsnIfJw59aAtqe8SVBkMZCKKXfQRFrtWO70qzQYU5tNx5MqrsZgtsMrbt4FqrB6G12tnwf925YzX69CQ";
const turso = createClient({
  url: isDev ? "file:local.db" : url,
  authToken: isDev ? void 0 : authToken
});
createClient({
  url: "http://127.0.0.1:8080"
});
const db = turso;

export { db as d };
