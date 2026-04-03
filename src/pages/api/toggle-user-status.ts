import type { APIRoute } from 'astro';
import { db } from '../../turso';
import { ROLES, checkRole } from '../../functions/checkRole';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const user = locals.user;
  
  if (!checkRole(user, [ROLES.ADMINISTRADOR, ROLES.JEFE_MEDICO])) {
    return new Response('Unauthorized', { status: 403 });
  }

  try {
    const data = await request.formData();
    const userId = data.get('userId');
    const currentState = data.get('currentState');

    if (!userId || !currentState) {
      return new Response('Missing params', { status: 400 });
    }

    const newState = Number(currentState) === 1 ? 0 : 1;

    await db.execute({
      sql: `UPDATE Users SET isActive = ? WHERE userId = ?`,
      args: [newState, userId as string]
    });

    return redirect('/users');
  } catch (error) {
    console.error('Error toggling user:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
