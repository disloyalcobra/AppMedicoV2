import type { APIRoute } from 'astro';
import { db } from '../../../turso';
import { getSession } from '../../../functions/getSession';
import { ROLES } from '../../../functions/checkRole';

export const POST: APIRoute = async ({ request, cookies }) => {
    const user = getSession(cookies);
    if (!user || ![ROLES.FISIOTERAPEUTA, ROLES.ADMINISTRADOR, ROLES.JEFE_MEDICO].includes(Number(user.roleId))) {
        return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 403 });
    }

    try {
        const { 
            appointmentId, planId, therapyType, durationMinutes, 
            painLevel, progressNotes, rangeOfMotion, strengthLevel 
        } = await request.json();

        if (!appointmentId || !planId || !therapyType) {
            return new Response(JSON.stringify({ error: 'Faltan datos obligatorios: appointmentId, planId, therapyType' }), { status: 400 });
        }

        // 1. Validar la cita
        const aptRes = await db.execute({
            sql: `SELECT * FROM Appointments WHERE appointmentId = ? AND appointmentType = 'Fisioterapia'`,
            args: [appointmentId]
        });

        if (aptRes.rows.length === 0) {
            return new Response(JSON.stringify({ error: 'Cita no encontrada o no es de fisioterapia' }), { status: 404 });
        }

        const appointment = aptRes.rows[0] as any;

        // 2. Validar que no exista sesión previa para esta cita
        const sessionCheck = await db.execute({
            sql: `SELECT 1 FROM PhysiotherapySessions WHERE appointmentId = ?`,
            args: [appointmentId]
        });

        if (sessionCheck.rows.length > 0) {
            return new Response(JSON.stringify({ error: 'Ya existe una sesión registrada para esta cita' }), { status: 409 });
        }

        // 3. Validar el plan
        const planRes = await db.execute({
            sql: `SELECT 1 FROM PhysiotherapyPlans WHERE planId = ? AND patientId = ?`,
            args: [planId, appointment.patientId]
        });

        if (planRes.rows.length === 0) {
            return new Response(JSON.stringify({ error: 'Plan no encontrado o no pertenece al paciente' }), { status: 404 });
        }

        // 4. Crear la sesión
        await db.execute({
            sql: `INSERT INTO PhysiotherapySessions (
                planId, patientId, injuryId, physiotherapistId, appointmentId, 
                sessionDate, therapyType, durationMinutes, painLevel, 
                rangeOfMotion, strengthLevel, progressNotes, status, createdBy
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Completada', ?)`,
            args: [
                planId, 
                appointment.patientId, 
                appointment.injuryId || null, 
                appointment.specialistId, 
                appointmentId, 
                appointment.dateTime, 
                therapyType, 
                durationMinutes || 60, 
                painLevel || null, 
                rangeOfMotion || null, 
                strengthLevel || null, 
                progressNotes || null, 
                user.userId
            ]
        });

        // 5. Marcar la cita como completada
        await db.execute({
            sql: `UPDATE Appointments SET status = 'Completada' WHERE appointmentId = ?`,
            args: [appointmentId]
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
