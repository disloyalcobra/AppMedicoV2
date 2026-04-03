import type { APIRoute } from 'astro';
import { db } from '../../turso';
import { ROLES, checkRole } from '../../functions/checkRole';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const user = locals.user;
  
  if (!user || !user.userId || !checkRole(user, [ROLES.ESTUDIANTE])) {
    return new Response('Unauthorized', { status: 403 });
  }

  try {
    const data = await request.formData();
    const planId = data.get('planId');

    if (!planId) {
      return new Response('Missing planId', { status: 400 });
    }

    // Update patientAccepted flag 
    // also ensuring it belongs to this patient just in case
    await db.execute({
      sql: `UPDATE NutritionalPlans SET patientAccepted = 1 WHERE planId = ? AND patientId = ?`,
      args: [planId as string, user.userId]
    });

    return redirect('/dashboard');
  } catch (error) {
    console.error('Error accepting plan:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
