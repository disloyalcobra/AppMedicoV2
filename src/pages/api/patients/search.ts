import type { APIRoute } from 'astro';
import { db } from '../../../turso';
import { getSession } from '../../../functions/getSession';

export const GET: APIRoute = async ({ request, cookies }) => {
    // 1. Authenticate user
    const user = getSession(cookies);
    if (!user) {
        return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
    }

    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    
    if (!q || q.trim().length < 2) {
        return new Response(JSON.stringify({ patients: [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const queryTerm = `%${q.trim()}%`;
        
        // Find patients that match the query but are NOT already linked to the user
        const res = await db.execute({
            sql: `
                SELECT u.userId, u.firstName, u.lastName, u.matricula, p.patientId
                FROM Users u
                JOIN Patients p ON u.userId = p.patientId
                LEFT JOIN User_Patient up 
                  ON up.patientId = p.patientId 
                  AND up.userId = ?
                WHERE up.patientId IS NULL
                AND (
                  u.firstName LIKE ?
                  OR u.lastName LIKE ?
                  OR u.matricula LIKE ?
                )
                LIMIT 20
            `,
            args: [user.userId, queryTerm, queryTerm, queryTerm]
        });

        return new Response(JSON.stringify({ patients: res.rows }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
