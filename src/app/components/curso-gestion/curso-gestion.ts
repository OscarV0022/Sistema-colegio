import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-curso-gestion',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './curso-gestion.html'
})
export class CursoGestion implements OnInit {
  niveles = ['1ro Básico', '2do Básico', '3ro Básico'];
  nivelSeleccionado: string | null = null;
  cursos: any[] = [];
  listaProfesores: any[] = [];
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarProfesores();
  }

  // Obtener los encabezados con el token de seguridad
  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Cargar lista de docentes disponibles para el selector
  cargarProfesores() {
    this.http.get(`${this.apiUrl}/usuarios/rol/profesor`, { headers: this.getHeaders() })
      .subscribe({
        next: (data: any) => this.listaProfesores = data,
        error: (err) => console.error('Error al cargar docentes:', err)
      });
  }

  // Filtrar cursos por grado académico
  cargarCursos(grado: string) {
    this.nivelSeleccionado = grado;
    this.http.get(`${this.apiUrl}/cursos/grado/${grado}`, { headers: this.getHeaders() })
      .subscribe({
        next: (data: any) => this.cursos = data,
        error: (err) => console.error('Error al cargar cursos:', err)
      });
  }

  // 🚀 ASIGNACIÓN: Vincular profesor al curso
  asignarProfe(cursoId: number, event: any) {
    const profesorId = event.target.value;
    
    this.http.put(`${this.apiUrl}/cursos/${cursoId}/profesor`, 
      { profesor_id: profesorId || null }, 
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => {
        console.log(`Profesor ${profesorId} asignado al curso ${cursoId}`);
        // Opcional: una notificación pequeña o alerta
      },
      error: (err) => alert('Error al asignar catedrático')
    });
  }

  verDetalle(cursoId: number) {
    console.log('Consultando alumnos inscritos en el curso:', cursoId);
    // Aquí podrías abrir un modal con la lista de estudiantes
  }
}