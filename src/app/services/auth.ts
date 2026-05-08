import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) { }

  login(carnet: string, password: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, { carnet, password }).pipe(
    tap((res: any) => {
      if (res.token && res.user) { // 👈 Verificamos que venga res.user
        localStorage.setItem('token', res.token);
        localStorage.setItem('rol', res.user.rol); // 👈 res.user.rol
        localStorage.setItem('id', res.user.id);   // 👈 res.user.id
      }
    })
  );
}

  getRol() { return localStorage.getItem('rol') || ''; }
  estaLogueado() { return !!localStorage.getItem('token'); }

  // 🚦 EL SEMÁFORO (Revisá que las rutas coincidan con tu app.routes.ts)
  redirigirSegunRol() {
    const rol = this.getRol();
    if (rol === 'admin') {
      this.router.navigate(['/dashboard']);
    } else if (rol === 'profesor') {
      this.router.navigate(['/docente/dashboard']);
    } else if (rol === 'estudiante') {
      // 🚀 Aquí es donde mandamos al "estudiante" de la DB a la carpeta "alumno"
      this.router.navigate(['/alumno/dashboard']); 
    } else {
      this.logout();
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}