import type { AstroCookies } from 'astro';

/**
 * Interface que representa la estructura de un usuario dentro de la sesión.
 * Incluye datos básicos para renderizar el perfil y manejar permisos.
 */
export interface SessionUser {
  userId: number;   // ID único del usuario en la base de datos
  roleId: number;   // ID del rol para control de acceso (RBAC)
  firstName: string;
  lastName: string;
}

/**
 * Función encargada de recuperar la sesión activa del usuario desde las cookies.
 * 
 * @param cookies - Objeto AstroCookies proporcionado por el contexto de Astro.
 * @returns Retorna un objeto SessionUser si la sesión es válida, o null si no hay sesión.
 * 
 * NOTA DE SEGURIDAD: En este prototipo se usa Base64 para facilitar el desarrollo.
 * Para producción, se recomienda usar JWT firmados (JSON Web Tokens).
 */
export function getSession(cookies: AstroCookies): SessionUser | null {
  // Intentamos obtener la cookie llamada 'session'
  const sessionCookie = cookies.get('session');
  
  // Si la cookie no existe o está vacía, no hay sesión activa
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    // Decodificamos el valor de la cookie de Base64 a texto UTF-8
    const decoded = Buffer.from(sessionCookie.value, 'base64').toString('utf-8');
    
    // Parseamos el JSON para obtener el objeto de usuario
    const user = JSON.parse(decoded) as SessionUser;
    
    // Aseguramos que el roleId sea tratado como número para evitar fallos de tipo
    if (user && user.roleId) {
      user.roleId = Number(user.roleId);
    }
    
    return user;
  } catch (error) {
    // Si hay un error en el parseo, la cookie podría estar corrupta o manipulada
    console.error('Error al parsear la cookie de sesión:', error);
    return null;
  }
}
