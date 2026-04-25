import type { APIRoute } from 'astro';
import { db } from '../../../turso';
import { getSession } from '../../../functions/getSession';
import { ROLES } from '../../../functions/checkRole';

const canWrite = (roleId: number) =>
  [ROLES.FISIOTERAPEUTA, ROLES.ADMINISTRADOR, ROLES.JEFE_MEDICO].includes(roleId);

/** Verifica que el usuario tiene acceso al plan (via User_Patient o es admin) */
async function hasAccessToPlan(userId: number, roleId: number, planId: number): Promise<boolean> {
  if ([ROLES.ADMINISTRADOR, ROLES.JEFE_MEDICO].includes(roleId)) return true;
  const res = await db.execute({
    sql: `SELECT 1 FROM User_Patient up
          JOIN PhysiotherapyPlans pp ON pp.patientId = up.patientId
          WHERE up.userId = ? AND pp.planId = ?`,
    args: [userId, planId]
  });
  return res.rows.length > 0;
}

// ─── GET /api/physiotherapy/plans?patientId=X ────────────────────────
export const GET: APIRoute = async ({ request, cookies }) => {
  const user = getSession(cookies);
  if (!user) return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });

  const roleId = Number(user.roleId);
  const url = new URL(request.url);
  const patientId = url.searchParams.get('patientId');

  try {
    let sql: string;
    let args: any[];

    if (patientId) {
      // Vista de expediente: planes de un paciente específico
      // Validar acceso al paciente para roles no admin
      if (![ROLES.ADMINISTRADOR, ROLES.JEFE_MEDICO].includes(roleId)) {
        const roleTypeMap: Record<number, string> = {
          [ROLES.FISIOTERAPEUTA]: 'Physiotherapist',
          [ROLES.DOCTOR]: 'Doctor',
        };
        const rt = roleTypeMap[roleId];
        if (rt) {
          const access = await db.execute({
            sql: `SELECT 1 FROM User_Patient WHERE userId = ? AND patientId = ? AND roleType = ?`,
            args: [user.userId, patientId, rt]
          });
          // Doctores pueden ver sin vínculo (solo lectura de expediente)
          if (access.rows.length === 0 && roleId !== ROLES.DOCTOR) {
            return new Response(JSON.stringify({ error: 'Sin acceso a este paciente' }), { status: 403 });
          }
        }
      }
      sql = `SELECT pp.*, u.firstName || ' ' || u.lastName as physiotherapistName,
                    i.injuryType, i.bodyZone,
                    (SELECT COUNT(*) FROM PhysiotherapySessions WHERE planId = pp.planId) as totalSessions,
                    (SELECT COUNT(*) FROM PhysiotherapySessions WHERE planId = pp.planId AND status = 'Completada') as completedSessions,
                    (SELECT painLevel FROM PhysiotherapySessions WHERE planId = pp.planId AND status = 'Completada' ORDER BY sessionDate DESC LIMIT 1) as lastPainLevel,
                    CASE 
                      WHEN pp.totalSessionsPlanned > 0 THEN 
                        (CAST((SELECT COUNT(*) FROM PhysiotherapySessions WHERE planId = pp.planId AND status = 'Completada') AS FLOAT) / pp.totalSessionsPlanned) * 100 
                      ELSE 0 
                    END as adherencePercentage
             FROM PhysiotherapyPlans pp
             JOIN Users u ON pp.physiotherapistId = u.userId
             LEFT JOIN Injuries i ON pp.injuryId = i.injuryId
             WHERE pp.patientId = ?
             ORDER BY pp.startDate DESC`;
      args = [patientId];
    } else {
      // Vista de dashboard del fisioterapeuta: sus propios planes
      if ([ROLES.ADMINISTRADOR, ROLES.JEFE_MEDICO].includes(roleId)) {
        sql = `SELECT pp.*, u.firstName || ' ' || u.lastName as physiotherapistName,
                      up2.firstName || ' ' || up2.lastName as patientName,
                      i.injuryType, i.bodyZone,
                      (SELECT COUNT(*) FROM PhysiotherapySessions WHERE planId = pp.planId) as totalSessions,
                      (SELECT COUNT(*) FROM PhysiotherapySessions WHERE planId = pp.planId AND status = 'Completada') as completedSessions,
                      (SELECT painLevel FROM PhysiotherapySessions WHERE planId = pp.planId AND status = 'Completada' ORDER BY sessionDate DESC LIMIT 1) as lastPainLevel,
                      CASE 
                        WHEN pp.totalSessionsPlanned > 0 THEN 
                          (CAST((SELECT COUNT(*) FROM PhysiotherapySessions WHERE planId = pp.planId AND status = 'Completada') AS FLOAT) / pp.totalSessionsPlanned) * 100 
                        ELSE 0 
                      END as adherencePercentage
               FROM PhysiotherapyPlans pp
               JOIN Users u ON pp.physiotherapistId = u.userId
               JOIN Users up2 ON pp.patientId = up2.userId
               LEFT JOIN Injuries i ON pp.injuryId = i.injuryId
               ORDER BY pp.startDate DESC`;
        args = [];
      } else {
        sql = `SELECT pp.*, u.firstName || ' ' || u.lastName as physiotherapistName,
                      up2.firstName || ' ' || up2.lastName as patientName,
                      i.injuryType, i.bodyZone,
                      (SELECT COUNT(*) FROM PhysiotherapySessions WHERE planId = pp.planId) as totalSessions,
                      (SELECT COUNT(*) FROM PhysiotherapySessions WHERE planId = pp.planId AND status = 'Completada') as completedSessions,
                      (SELECT painLevel FROM PhysiotherapySessions WHERE planId = pp.planId AND status = 'Completada' ORDER BY sessionDate DESC LIMIT 1) as lastPainLevel,
                      CASE 
                        WHEN pp.totalSessionsPlanned > 0 THEN 
                          (CAST((SELECT COUNT(*) FROM PhysiotherapySessions WHERE planId = pp.planId AND status = 'Completada') AS FLOAT) / pp.totalSessionsPlanned) * 100 
                        ELSE 0 
                      END as adherencePercentage
               FROM PhysiotherapyPlans pp
               JOIN Users u ON pp.physiotherapistId = u.userId
               JOIN Users up2 ON pp.patientId = up2.userId
               LEFT JOIN Injuries i ON pp.injuryId = i.injuryId
               WHERE pp.physiotherapistId = ?
               ORDER BY pp.startDate DESC`;
        args = [user.userId];
      }
    }

    const res = await db.execute({ sql, args });
    return new Response(JSON.stringify(res.rows), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

// ─── POST /api/physiotherapy/plans ───────────────────────────────────
export const POST: APIRoute = async ({ request, cookies }) => {
  const user = getSession(cookies);
  if (!user || !canWrite(Number(user.roleId))) {
    return new Response(JSON.stringify({ error: 'Sin permisos' }), { status: 403 });
  }

  try {
    const { patientId, physiotherapistId, injuryId, goals, totalSessionsPlanned, startDate, endDate } = await request.json();

    if (!patientId || !physiotherapistId || !startDate) {
      return new Response(JSON.stringify({ error: 'Faltan campos obligatorios: patientId, physiotherapistId, startDate' }), { status: 400 });
    }

    // Verificar duplicado: no puede haber plan activo para el mismo paciente + lesión
    const dupCheck = await db.execute({
      sql: `SELECT planId FROM PhysiotherapyPlans
            WHERE patientId = ? AND injuryId IS ? AND status = 'Activo'`,
      args: [patientId, injuryId ?? null]
    });
    if (dupCheck.rows.length > 0) {
      return new Response(JSON.stringify({
        error: 'Ya existe un plan activo para este paciente' + (injuryId ? ' y lesión' : ''),
        existingPlanId: dupCheck.rows[0].planId
      }), { status: 409 });
    }

    // Crear plan
    const result = await db.execute({
      sql: `INSERT INTO PhysiotherapyPlans
            (patientId, physiotherapistId, injuryId, goals, totalSessionsPlanned, startDate, endDate, status, createdBy)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Activo', ?)`,
      args: [patientId, physiotherapistId, injuryId ?? null, goals ?? null, totalSessionsPlanned ?? 0, startDate, endDate ?? null, user.userId]
    });

    const planId = Number(result.lastInsertRowid);

    // Auto-vincular fisioterapeuta al paciente en User_Patient
    await db.execute({
      sql: `INSERT OR IGNORE INTO User_Patient (userId, patientId, roleType) VALUES (?, ?, 'Physiotherapist')`,
      args: [physiotherapistId, patientId]
    });

    return new Response(JSON.stringify({ success: true, planId }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

// ─── PATCH /api/physiotherapy/plans ──────────────────────────────────
export const PATCH: APIRoute = async ({ request, cookies }) => {
  const user = getSession(cookies);
  if (!user || !canWrite(Number(user.roleId))) {
    return new Response(JSON.stringify({ error: 'Sin permisos' }), { status: 403 });
  }

  try {
    const { planId, goals, totalSessionsPlanned, endDate, status } = await request.json();
    if (!planId) return new Response(JSON.stringify({ error: 'planId requerido' }), { status: 400 });

    // Verificar acceso al plan
    const access = await hasAccessToPlan(Number(user.userId), Number(user.roleId), planId);
    if (!access) return new Response(JSON.stringify({ error: 'Sin acceso a este plan' }), { status: 403 });

    // Validar que no se pueda reactivar un plan con alta
    if (status === 'Activo') {
      const dischargeCheck = await db.execute({
        sql: `SELECT 1 FROM PhysiotherapyDischarges WHERE planId = ?`,
        args: [planId]
      });
      if (dischargeCheck.rows.length > 0) {
        return new Response(JSON.stringify({ error: 'No se puede reactivar un plan con alta registrada' }), { status: 409 });
      }
    }

    const fields: string[] = [];
    const args: any[] = [];
    if (goals !== undefined) { fields.push('goals = ?'); args.push(goals); }
    if (totalSessionsPlanned !== undefined) { fields.push('totalSessionsPlanned = ?'); args.push(totalSessionsPlanned); }
    if (endDate !== undefined) { fields.push('endDate = ?'); args.push(endDate); }
    if (status !== undefined) { fields.push('status = ?'); args.push(status); }

    if (fields.length === 0) return new Response(JSON.stringify({ error: 'Sin cambios' }), { status: 400 });

    args.push(planId);
    await db.execute({ sql: `UPDATE PhysiotherapyPlans SET ${fields.join(', ')} WHERE planId = ?`, args });

    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
