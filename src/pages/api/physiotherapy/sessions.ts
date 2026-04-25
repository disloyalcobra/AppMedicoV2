import type { APIRoute } from 'astro';
import { db } from '../../../turso';
import { getSession } from '../../../functions/getSession';
import { ROLES } from '../../../functions/checkRole';

const canWrite = (roleId: number) =>
  [ROLES.FISIOTERAPEUTA, ROLES.ADMINISTRADOR, ROLES.JEFE_MEDICO].includes(roleId);

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

// ─── GET /api/physiotherapy/sessions?planId=X ────────────────────────
export const GET: APIRoute = async ({ request, cookies }) => {
  const user = getSession(cookies);
  if (!user) return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });

  const url = new URL(request.url);
  const planId = url.searchParams.get('planId');
  if (!planId) return new Response(JSON.stringify({ error: 'planId requerido' }), { status: 400 });

  const access = await hasAccessToPlan(Number(user.userId), Number(user.roleId), Number(planId));
  if (!access) return new Response(JSON.stringify({ error: 'Sin acceso' }), { status: 403 });

  try {
    const res = await db.execute({
      sql: `SELECT s.*, u.firstName || ' ' || u.lastName as createdByName
            FROM PhysiotherapySessions s
            JOIN Users u ON s.createdBy = u.userId
            WHERE s.planId = ?
            ORDER BY s.sessionDate DESC`,
      args: [planId]
    });
    return new Response(JSON.stringify(res.rows), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

// ─── POST /api/physiotherapy/sessions ────────────────────────────────
export const POST: APIRoute = async ({ request, cookies }) => {
  const user = getSession(cookies);
  if (!user || !canWrite(Number(user.roleId))) {
    return new Response(JSON.stringify({ error: 'Sin permisos' }), { status: 403 });
  }

  try {
    const {
      planId, appointmentId, sessionDate, therapyType,
      durationMinutes, painLevel, rangeOfMotion, strengthLevel, progressNotes
    } = await request.json();

    const finalSessionDate = sessionDate || new Date().toISOString().split('T')[0];

    if (!planId || !therapyType) {
      return new Response(JSON.stringify({ error: 'Faltan campos: planId, therapyType' }), { status: 400 });
    }

    // Verificar acceso
    const access = await hasAccessToPlan(Number(user.userId), Number(user.roleId), planId);
    if (!access) return new Response(JSON.stringify({ error: 'Sin acceso al plan' }), { status: 403 });

    // Verificar que el plan esté activo
    const planCheck = await db.execute({
      sql: `SELECT status FROM PhysiotherapyPlans WHERE planId = ?`,
      args: [planId]
    });
    if (planCheck.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Plan no encontrado' }), { status: 404 });
    }
    if (planCheck.rows[0].status === 'Cancelado') {
      return new Response(JSON.stringify({ error: 'No se pueden agregar sesiones a un plan cancelado' }), { status: 409 });
    }

    // Validar appointmentId solo si viene
    if (appointmentId) {
      const aptCheck = await db.execute({
        sql: `SELECT 1 FROM Appointments WHERE appointmentId = ?`,
        args: [appointmentId]
      });
      if (aptCheck.rows.length === 0) {
        return new Response(JSON.stringify({ error: 'Cita no encontrada' }), { status: 404 });
      }
    }

    // Obtener patientId, injuryId y physiotherapistId del plan
    const planInfo = await db.execute({
      sql: `SELECT patientId, injuryId, physiotherapistId FROM PhysiotherapyPlans WHERE planId = ?`,
      args: [planId]
    });
    if (planInfo.rows.length === 0) return new Response(JSON.stringify({ error: 'Plan no encontrado' }), { status: 404 });
    const { patientId, injuryId, physiotherapistId } = planInfo.rows[0] as any;

    const result = await db.execute({
      sql: `INSERT INTO PhysiotherapySessions
            (planId, patientId, injuryId, physiotherapistId, appointmentId, sessionDate, therapyType, durationMinutes, painLevel,
             rangeOfMotion, strengthLevel, progressNotes, status, createdBy)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Programada', ?)`,
      args: [
        planId, patientId, injuryId, physiotherapistId, appointmentId ?? null, finalSessionDate, therapyType,
        durationMinutes ?? 60, painLevel ?? null, rangeOfMotion ?? null,
        strengthLevel ?? null, progressNotes ?? null, user.userId
      ]
    });

    return new Response(JSON.stringify({ success: true, sessionId: Number(result.lastInsertRowid) }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

// ─── PATCH /api/physiotherapy/sessions ───────────────────────────────
export const PATCH: APIRoute = async ({ request, cookies }) => {
  const user = getSession(cookies);
  if (!user || !canWrite(Number(user.roleId))) {
    return new Response(JSON.stringify({ error: 'Sin permisos' }), { status: 403 });
  }

  try {
    const { sessionId, status, painLevel, rangeOfMotion, strengthLevel, progressNotes, durationMinutes } = await request.json();
    if (!sessionId) return new Response(JSON.stringify({ error: 'sessionId requerido' }), { status: 400 });

    // Verificar acceso vía plan
    const sessionRes = await db.execute({
      sql: `SELECT planId FROM PhysiotherapySessions WHERE sessionId = ?`,
      args: [sessionId]
    });
    if (sessionRes.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Sesión no encontrada' }), { status: 404 });
    }
    const planId = Number(sessionRes.rows[0].planId);
    const access = await hasAccessToPlan(Number(user.userId), Number(user.roleId), planId);
    if (!access) return new Response(JSON.stringify({ error: 'Sin acceso' }), { status: 403 });

    const fields: string[] = [];
    const args: any[] = [];
    if (status !== undefined) { fields.push('status = ?'); args.push(status); }
    if (painLevel !== undefined) { fields.push('painLevel = ?'); args.push(painLevel); }
    if (rangeOfMotion !== undefined) { fields.push('rangeOfMotion = ?'); args.push(rangeOfMotion); }
    if (strengthLevel !== undefined) { fields.push('strengthLevel = ?'); args.push(strengthLevel); }
    if (progressNotes !== undefined) { fields.push('progressNotes = ?'); args.push(progressNotes); }
    if (durationMinutes !== undefined) { fields.push('durationMinutes = ?'); args.push(durationMinutes); }

    if (fields.length === 0) return new Response(JSON.stringify({ error: 'Sin cambios' }), { status: 400 });

    args.push(sessionId);
    await db.execute({ sql: `UPDATE PhysiotherapySessions SET ${fields.join(', ')} WHERE sessionId = ?`, args });

    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
