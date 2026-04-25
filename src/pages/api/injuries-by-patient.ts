import type { APIRoute } from 'astro';
import { db } from '../../turso';
import { getSession } from '../../functions/getSession';
import { ROLES } from '../../functions/checkRole';

// GET /api/injuries-by-patient?patientId=X
export const GET: APIRoute = async ({ request, cookies }) => {
  const user = getSession(cookies);
  if (!user) return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });

  const url = new URL(request.url);
  const patientId = url.searchParams.get('patientId');
  if (!patientId) return new Response(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });

  try {
    const res = await db.execute({
      sql: `SELECT injuryId, injuryType, bodyZone, status, injuryDate
            FROM Injuries WHERE patientId = ?
            ORDER BY injuryDate DESC`,
      args: [patientId]
    });
    return new Response(JSON.stringify(res.rows), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
