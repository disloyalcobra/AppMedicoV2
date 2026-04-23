import type { APIRoute } from 'astro';
import { db } from '../../../turso';
import { getSession } from '../../../functions/getSession';
import { ROLES } from '../../../functions/checkRole';

export const POST: APIRoute = async ({ request, cookies }) => {
    const user = getSession(cookies);
    if (!user) {
        return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
    }

    try {
        const { doctorId, patientId, dateTime, reason } = await request.json();

        if (!doctorId || !patientId || !dateTime) {
            return new Response(JSON.stringify({ error: 'Faltan datos obligatorios' }), { status: 400 });
        }

        // 1. Race condition protection: Validate slot is STILL free
        const checkRes = await db.execute({
            sql: `SELECT 1 FROM Appointments 
                  WHERE doctorId = ? 
                  AND dateTime = ? 
                  AND status IN ('Pendiente', 'Confirmada')`,
            args: [doctorId, dateTime]
        });

        if (checkRes.rows.length > 0) {
            return new Response(JSON.stringify({ error: 'Este horario ya ha sido reservado por otro usuario.' }), { status: 409 });
        }

        // 2. Insert Appointment
        const result = await db.execute({
            sql: `INSERT INTO Appointments (patientId, doctorId, dateTime, status, reason) VALUES (?, ?, ?, 'Pendiente', ?)`,
            args: [patientId, doctorId, dateTime, reason || '']
        });

        // 3. Auto-vinculación (Centralized logic)
        // Link doctor to patient
        await db.execute({
            sql: `INSERT OR IGNORE INTO User_Patient (userId, patientId, roleType) VALUES (?, ?, 'Doctor')`,
            args: [doctorId, patientId]
        });

        return new Response(JSON.stringify({ success: true, appointmentId: Number(result.lastInsertRowid) }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
