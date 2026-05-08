import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-alumno-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  // 🚀 Usamos el CSS del docente para mantener la consistencia visual
  styleUrl: '../../docente/docente-dashboard/docente-dashboard.css' 
})
export class AlumnoDashboard implements OnInit {
  cursos: any[] = [];
  nombre: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // 1. Recuperamos el nombre guardado en el login para el saludo
    this.nombre = localStorage.getItem('nombre') || 'Estudiante';
    
    // 2. Cargamos los cursos asignados
    this.cargarCursos();
  }

  cargarCursos() {
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    // 🛡️ Seguridad: Si no hay token o id, no hacemos nada
    if (!id || !token) {
      console.error('No se encontró sesión activa');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    console.log('Solicitando cursos para el estudiante:', id);

    // 🎯 Apuntamos a la ruta específica que creamos en el Backend
    this.http.get(`http://localhost:3000/api/cursos/estudiante/${id}`, { headers })
      .subscribe({
        next: (res: any) => {
          this.cursos = res;
          console.log('Cursos cargados con éxito:', res);
        },
        error: (err) => {
          console.error('Error al conectar con el servidor:', err);
        }
      });
  }
}