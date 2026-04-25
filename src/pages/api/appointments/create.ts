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

        const userRoleId = Number(user.roleId);
        let finalDoctorId = doctorId;

        // --- VALIDACIONES DE SEGURIDAD Y REGLAS DE NEGOCIO ---

        // 1. Si el usuario es clínico, forzamos que el especialista sea él mismo
        if ([ROLES.DOCTOR, ROLES.NUTRIOLOGO, ROLES.FISIOTERAPEUTA].includes(userRoleId)) {
            finalDoctorId = user.userId;
        }

        // 2. Si el usuario es ENTRENADOR, validar relación con estudiante
        if (userRoleId === ROLES.ENTRENADOR) {
            const relCheck = await db.execute({
                sql: `SELECT 1 FROM User_Patient WHERE userId = ? AND patientId = ? AND roleType = 'Coach'`,
                args: [user.userId, patientId]
            });
            if (relCheck.rows.length === 0) {
                return new Response(JSON.stringify({ error: 'No tienes permiso para agendar citas a este estudiante.' }), { status: 403 });
            }
        }

        // 3. Obtener rol del especialista para validaciones y determinar appointmentType
        const specialistRes = await db.execute({
            sql: `SELECT roleId FROM Users WHERE userId = ?`,
            args: [finalDoctorId]
        });

        if (specialistRes.rows.length === 0) {
            return new Response(JSON.stringify({ error: 'El especialista seleccionado no existe.' }), { status: 404 });
        }

        const specialistRoleId = Number(specialistRes.rows[0]?.roleId);

        // 4. Validar que el entrenador solo agende con doctores
        if (userRoleId === ROLES.ENTRENADOR && ![ROLES.DOCTOR, ROLES.JEFE_MEDICO].includes(specialistRoleId)) {
            return new Response(JSON.stringify({ error: 'Como entrenador, solo puedes agendar citas con médicos.' }), { status: 403 });
        }

        // 5. Protección contra Race Condition: Validar slot libre
        const checkRes = await db.execute({
            sql: `SELECT 1 FROM Appointments 
                  WHERE specialistId = ? 
                  AND dateTime = ? 
                  AND status IN ('Pendiente', 'Confirmada')`,
            args: [finalDoctorId, dateTime]
        });

        if (checkRes.rows.length > 0) {
            return new Response(JSON.stringify({ error: 'Este horario ya ha sido reservado por otro usuario.' }), { status: 409 });
        }

        // --- LÓGICA DE TIPO DE CITA ---
        
        let appointmentType = 'Medica';
        let linkRoleType = 'Doctor';

        if (specialistRoleId === ROLES.NUTRIOLOGO) {
            appointmentType = 'Nutricion';
            linkRoleType = 'Nutritionist';
        } else if (specialistRoleId === ROLES.FISIOTERAPEUTA) {
            appointmentType = 'Fisioterapia';
            linkRoleType = 'Physiotherapist';
        } else if (specialistRoleId === ROLES.ENTRENADOR) {
            appointmentType = 'Entrenamiento';
            linkRoleType = 'Coach';
        }

        // 6. Inserción de la Cita
        const result = await db.execute({
            sql: `INSERT INTO Appointments (patientId, specialistId, createdBy, dateTime, status, reason, appointmentType) VALUES (?, ?, ?, ?, 'Pendiente', ?, ?)`,
            args: [patientId, finalDoctorId, user.userId, dateTime, reason || '', appointmentType]
        });

        // 7. Auto-vinculación con el rol correcto
        await db.execute({
            sql: `INSERT OR IGNORE INTO User_Patient (userId, patientId, roleType) VALUES (?, ?, ?)`,
            args: [finalDoctorId, patientId, linkRoleType]
        });

        return new Response(JSON.stringify({ success: true, appointmentId: Number(result.lastInsertRowid) }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
