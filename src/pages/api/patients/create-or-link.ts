import type { APIRoute } from 'astro';
import { db } from '../../../turso';
import { getSession } from '../../../functions/getSession';
import { ROLES } from '../../../functions/checkRole';

export const POST: APIRoute = async ({ request, cookies }) => {
    const user = getSession(cookies);
    if (!user || ![ROLES.DOCTOR, ROLES.JEFE_MEDICO, ROLES.ADMINISTRADOR, ROLES.NUTRIOLOGO, ROLES.ENTRENADOR, ROLES.FISIOTERAPEUTA].includes(Number(user.roleId))) {
        return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
    }

    try {
        const body = await request.json();
        const { 
            firstName, lastName, email, matricula, 
            dateOfBirth, gender, bloodType, weight, height, 
            isAthlete, schoolLevel, coachId, allergies,
            action // 'create' or 'link'
        } = body;

        // Normalize text
        const cleanMatricula = matricula?.trim().toUpperCase();
        const cleanEmail = email?.trim().toLowerCase();

        // 1. Check for existing user by matricula or email
        let existingUser: any = null;
        if (cleanMatricula || cleanEmail) {
            const searchSql = `SELECT userId FROM Users WHERE (matricula IS NOT NULL AND matricula = ?) OR (email IS NOT NULL AND email = ?)`;
            const searchRes = await db.execute({
                sql: searchSql,
                args: [cleanMatricula || null, cleanEmail || null]
            });
            if (searchRes.rows.length > 0) {
                existingUser = searchRes.rows[0];
            }
        }

        let targetPatientId: number;

        if (existingUser && action === 'link') {
            targetPatientId = Number(existingUser.userId);
            // Ensure record exists in Patients table (might be a user with no patient record yet)
            const pCheck = await db.execute({
                sql: `SELECT patientId FROM Patients WHERE patientId = ?`,
                args: [targetPatientId]
            });
            if (pCheck.rows.length === 0) {
                // Create patient record for existing user
                await db.execute({
                    sql: `INSERT INTO Patients (patientId, dateOfBirth, gender, bloodType, allergies, weight, height, isAthlete, schoolLevel)
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    args: [dateOfBirth || null, gender || 'M', bloodType || null, allergies || null, weight || null, height || null, isAthlete ? 1 : 0, schoolLevel || null]
                });
            }
        } else if (!existingUser && action === 'create') {
            // Create new user and patient
            const batch = await db.batch([
                {
                    sql: `INSERT INTO Users (firstName, lastName, email, matricula, roleId) VALUES (?, ?, ?, ?, ?)`,
                    args: [firstName, lastName, cleanEmail || null, cleanMatricula || null, ROLES.ESTUDIANTE]
                },
                {
                    sql: `INSERT INTO Patients (patientId, dateOfBirth, gender, bloodType, allergies, weight, height, isAthlete, schoolLevel)
                          VALUES (last_insert_rowid(), ?, ?, ?, ?, ?, ?, ?, ?)`,
                    args: [dateOfBirth, gender, bloodType, allergies, weight, height, isAthlete ? 1 : 0, schoolLevel]
                }
            ], "write");
            
            // Get the new ID
            const lastIdRes = await db.execute("SELECT last_insert_rowid() as id");
            targetPatientId = Number(lastIdRes.rows[0].id);
        } else if (existingUser && action === 'create') {
            return new Response(JSON.stringify({ error: 'El usuario ya existe. Usa la opción de vincular.' }), { status: 400 });
        } else {
            return new Response(JSON.stringify({ error: 'Operación no válida' }), { status: 400 });
        }

        // 3. Link current user to patient
        const roleMap: Record<number, string> = {
            [ROLES.DOCTOR]: 'Doctor',
            [ROLES.NUTRIOLOGO]: 'Nutritionist',
            [ROLES.ENTRENADOR]: 'Coach',
            [ROLES.FISIOTERAPEUTA]: 'Physiotherapist',
            [ROLES.ADMINISTRADOR]: 'Admin',
            [ROLES.JEFE_MEDICO]: 'Admin'
        };
        const creatorRole = roleMap[Number(user.roleId)] || 'Other';

        await db.execute({
            sql: `INSERT OR IGNORE INTO User_Patient (userId, patientId, roleType) VALUES (?, ?, ?)`,
            args: [user.userId, targetPatientId, creatorRole]
        });

        // 4. If coachId provided and different, link them too
        if (isAthlete && coachId && Number(coachId) !== Number(user.userId)) {
            await db.execute({
                sql: `INSERT OR IGNORE INTO User_Patient (userId, patientId, roleType) VALUES (?, ?, 'Coach')`,
                args: [coachId, targetPatientId]
            });
        }

        return new Response(JSON.stringify({ 
            success: true, 
            patientId: targetPatientId,
            message: action === 'link' ? 'Paciente vinculado correctamente' : 'Paciente creado y vinculado'
        }), { status: 200 });

    } catch (e: any) {
        console.error('Error in create-or-link:', e);
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
