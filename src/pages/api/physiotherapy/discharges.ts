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

// ─── GET /api/physiotherapy/discharges?planId=X ──────────────────────
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
      sql: `SELECT * FROM PhysiotherapyDischarges WHERE planId = ?`,
      args: [planId]
    });
    return new Response(JSON.stringify(res.rows[0] ?? null), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

// ─── POST /api/physiotherapy/discharges ──────────────────────────────
export const POST: APIRoute = async ({ request, cookies }) => {
  const user = getSession(cookies);
  if (!user || !canWrite(Number(user.roleId))) {
    return new Response(JSON.stringify({ error: 'Sin permisos' }), { status: 403 });
  }

  try {
    const { planId, dischargeDate, outcome, recommendations } = await request.json();
    if (!planId) return new Response(JSON.stringify({ error: 'planId requerido' }), { status: 400 });

    // Verificar acceso
    const access = await hasAccessToPlan(Number(user.userId), Number(user.roleId), planId);
    if (!access) return new Response(JSON.stringify({ error: 'Sin acceso al plan' }), { status: 403 });

    // Verificar que el plan existe y está activo
    const planCheck = await db.execute({
      sql: `SELECT status FROM PhysiotherapyPlans WHERE planId = ?`,
      args: [planId]
    });
    if (planCheck.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Plan no encontrado' }), { status: 404 });
    }
    if (planCheck.rows[0].status !== 'Activo') {
      return new Response(JSON.stringify({ error: 'Solo se puede dar de alta a planes activos' }), { status: 409 });
    }

    // Verificar que no existe ya un alta
    const dupCheck = await db.execute({
      sql: `SELECT 1 FROM PhysiotherapyDischarges WHERE planId = ?`,
      args: [planId]
    });
    if (dupCheck.rows.length > 0) {
      return new Response(JSON.stringify({ error: 'Este plan ya tiene un alta registrada' }), { status: 409 });
    }

    // Crear alta en transacción: insertar alta + marcar plan como Completado
    await db.execute({
      sql: `INSERT INTO PhysiotherapyDischarges (planId, dischargeDate, outcome, recommendations)
            VALUES (?, ?, ?, ?)`,
      args: [planId, dischargeDate ?? new Date().toISOString().split('T')[0], outcome ?? null, recommendations ?? null]
    });

    // Marcar plan como Completado automáticamente
    await db.execute({
      sql: `UPDATE PhysiotherapyPlans SET status = 'Completado', endDate = ? WHERE planId = ?`,
      args: [dischargeDate ?? new Date().toISOString().split('T')[0], planId]
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
