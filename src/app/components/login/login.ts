import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  carnet = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    this.authService.login(this.carnet, this.password).subscribe({
      next: (res: any) => {
        // 💾 1. Guardamos la info usando la estructura que manda tu Backend (res.user)
        localStorage.setItem('token', res.token);
        localStorage.setItem('rol', res.user.rol);
        localStorage.setItem('id', res.user.id);
        localStorage.setItem('nombre', res.user.nombre);

        // 🚦 2. Redirección basada en el rol de la base de datos
        const userRol = res.user.rol;

        if (userRol === 'admin') {
          console.log('Nivel: Administrador');
          this.router.navigate(['/dashboard']);
        } else if (userRol === 'profesor') {
          console.log('Nivel: Docente');
          this.router.navigate(['/docente/dashboard']);
        } else if (userRol === 'estudiante') { // 🚀 ¡ESTE ES EL QUE FALTABA!
          console.log('Nivel: Alumno');
          this.router.navigate(['/alumno/dashboard']); // Lo mandamos a la ruta del alumno
        } else {
          alert('Rol no reconocido (' + userRol + '). Contactá al soporte.');
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        console.error('Error en login:', err);
        alert('Credenciales incorrectas o usuario inactivo.');
      }
    });
  }
}