import type { APIRoute } from 'astro';
import { db } from '../../turso';
import { getSession } from '../../functions/getSession';
import { ROLES } from '../../functions/checkRole';

export const GET: APIRoute = async ({ request, cookies }) => {
    const user = getSession(cookies);
    if (!user || ![ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ADMINISTRADOR, ROLES.NUTRIOLOGO].includes(user.roleId)) {
        return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
    }

    const url = new URL(request.url);
    const doctorId = url.searchParams.get('doctorId') ? Number(url.searchParams.get('doctorId')) : user.userId;

    // Admin can view any doctor, others only their own
    if (user.roleId !== ROLES.ADMINISTRADOR && doctorId !== user.userId) {
        return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 403 });
    }

    try {
        const res = await db.execute({
            sql: `SELECT * FROM Doctor_Availability WHERE doctorId = ? ORDER BY dayOfWeek ASC`,
            args: [doctorId]
        });

        return new Response(JSON.stringify({ availability: res.rows }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};

export const POST: APIRoute = async ({ request, cookies }) => {
    const user = getSession(cookies);
    if (!user || ![ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ADMINISTRADOR, ROLES.NUTRIOLOGO].includes(user.roleId)) {
        return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
    }

    try {
        const { schedules, doctorId } = await request.json();

        if (!Array.isArray(schedules)) {
            return new Response(JSON.stringify({ error: 'Invalid data format' }), { status: 400 });
        }

        // Determine target doctor - admin can set any, others only their own
        const isAdmin = user.roleId === ROLES.ADMINISTRADOR;
        const targetDoctorId = isAdmin && doctorId ? doctorId : user.userId;

        // Use a transaction/batch to update all schedules for the doctor
        const batch = [];

        batch.push({
            sql: `DELETE FROM Doctor_Availability WHERE doctorId = ?`,
            args: [targetDoctorId]
        });

        for (const s of schedules) {
            batch.push({
                sql: `INSERT INTO Doctor_Availability (doctorId, dayOfWeek, startTime, endTime, slotDuration, isActive) VALUES (?, ?, ?, ?, ?, ?)`,
                args: [targetDoctorId, s.dayOfWeek, s.startTime, s.endTime, s.slotDuration || 30, s.isActive ? 1 : 0]
            });
        }

        await db.batch(batch, "write");

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
