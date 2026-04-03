import { d as db } from './turso_BY-aYcMZ.mjs';
import { c as checkRole, R as ROLES } from './checkRole_Bhgz0jTJ.mjs';

const POST = async ({ request, locals, redirect }) => {
  const user = locals.user;
  if (!user || !user.userId || !checkRole(user, [ROLES.ESTUDIANTE])) {
    return new Response("Unauthorized", { status: 403 });
  }
  try {
    const data = await request.formData();
    const planId = data.get("planId");
    if (!planId) {
      return new Response("Missing planId", { status: 400 });
    }
    await db.execute({
      sql: `UPDATE NutritionalPlans SET patientAccepted = 1 WHERE planId = ? AND patientId = ?`,
      args: [planId, user.userId]
    });
    return redirect("/dashboard");
  } catch (error) {
    console.error("Error accepting plan:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
