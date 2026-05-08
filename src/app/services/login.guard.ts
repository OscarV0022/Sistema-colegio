import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  if (authService.estaLogueado()) {
    authService.redirigirSegunRol(); // Si ya está adentro, que no regrese al login
    return false;
  }
  return true;
};