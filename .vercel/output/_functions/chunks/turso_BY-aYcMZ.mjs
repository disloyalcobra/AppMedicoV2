import { createClient } from '@libsql/client';
import 'dotenv/config';

const url = "libsql://appmedica-disloyalcobra.aws-us-east-1.turso.io";
const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzMyOTE0NzMsImlkIjoiMDE5Y2UwNjUtYjYwMS03NmNlLTliZTQtMzJkZmMyZjhlMmI1IiwicmlkIjoiZGJiYjNlMzctZTU3OS00OGE3LTg0YjktZWQyODE5Mzk1MjJlIn0.ubWoOnXsnIfJw59aAtqe8SVBkMZCKKXfQRFrtWO70qzQYU5tNx5MqrsZgtsMrbt4FqrB6G12tnwf925YzX69CQ";
const turso = createClient({
  url,
  authToken
});
createClient({
  url: "http://127.0.0.1:8080"
});
const db = turso;

export { db as d };
