import type { APIRoute } from 'astro';
import { db } from '../../turso';
import { getSession } from '../../functions/getSession';
import { ROLES } from '../../functions/checkRole';

export const POST: APIRoute = async ({ request, cookies }) => {
    // 1. Authenticate user
    const user = getSession(cookies);
    if (!user) {
        return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
    }

    try {
        const data = await request.json();
        const { patientId } = data;

        if (!patientId) {
            return new Response(JSON.stringify({ error: 'patientId is required' }), { status: 400 });
        }

        // Determine roleType based on user session role
        let roleType = '';
        if (user.roleId === ROLES.DOCTOR) roleType = 'Doctor';
        else if (user.roleId === ROLES.NUTRIOLOGO) roleType = 'Nutritionist';
        else if (user.roleId === ROLES.ENTRENADOR) roleType = 'Coach';
        else if (user.roleId === ROLES.FISIOTERAPEUTA) roleType = 'Physiotherapist';
        else {
            return new Response(JSON.stringify({ error: 'No tienes permisos para vincular pacientes' }), { status: 403 });
        }

        // Insert OR IGNORE
        await db.execute({
            sql: `INSERT OR IGNORE INTO User_Patient (userId, patientId, roleType) VALUES (?, ?, ?)`,
            args: [user.userId, patientId, roleType]
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
