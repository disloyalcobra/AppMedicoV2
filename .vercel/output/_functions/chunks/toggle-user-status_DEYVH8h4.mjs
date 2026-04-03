import { d as db } from './turso_BY-aYcMZ.mjs';
import { c as checkRole, R as ROLES } from './checkRole_Bhgz0jTJ.mjs';

const POST = async ({ request, locals, redirect }) => {
  const user = locals.user;
  if (!checkRole(user, [ROLES.ADMINISTRADOR, ROLES.JEFE_MEDICO])) {
    return new Response("Unauthorized", { status: 403 });
  }
  try {
    const data = await request.formData();
    const userId = data.get("userId");
    const currentState = data.get("currentState");
    if (!userId || !currentState) {
      return new Response("Missing params", { status: 400 });
    }
    const newState = Number(currentState) === 1 ? 0 : 1;
    await db.execute({
      sql: `UPDATE Users SET isActive = ? WHERE userId = ?`,
      args: [newState, userId]
    });
    return redirect("/users");
  } catch (error) {
    console.error("Error toggling user:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
