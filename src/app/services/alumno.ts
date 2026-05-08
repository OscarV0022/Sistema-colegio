import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // 🚀 FUNCIÓN ESTRELLA: Subir la tarea al servidor
  subirEntrega(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    // Configuramos los headers con el Bearer Token para que el middleware lo deje pasar
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Mandamos el FormData que contiene el ID del alumno, el ID de la tarea y el PDF
    return this.http.post(`${this.apiUrl}/tareas/entregar`, formData, { headers });
  }

  // 📈 Por si después querés que el alumno mire su progreso
  obtenerMisNotas(cursoId: number, alumnoId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/notas/alumno/${cursoId}/${alumnoId}`, { headers });
  }
}