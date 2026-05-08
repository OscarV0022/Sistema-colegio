import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth'; // 👈 Tu servicio

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const rolUsuario = authService.getRol();

  // 1. ¿Ni siquiera está logueado? ¡Para afuera!
  if (!authService.estaLogueado()) {
    authService.logout();
    return false;
  }

  // 2. ¿La ruta pide un rol que el usuario no tiene?
  const rolesPermitidos = route.data['roles'] as Array<string>;
  if (rolesPermitidos && !rolesPermitidos.includes(rolUsuario)) {
    alert('⚠️ Acceso Denegado: No tienes permisos para esta área.');
    authService.redirigirSegunRol(); // Lo mandamos a SU dashboard
    return false;
  }

  return true;
};