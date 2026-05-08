import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {
  private apiUrl = 'http://localhost:3000/api/usuarios';
  private apiBase = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  /**
   * 🛠️ MÉTODO PRIVADO: Genera los headers estándar (JSON + Token)
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ======================================================
  // 1. GESTIÓN DE DOCENTES (VISTA ADMIN)
  // ======================================================

  getDocentes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rol/profesor`, { headers: this.getHeaders() });
  }

  crearDocente(docente: any): Observable<any> {
    return this.http.post(this.apiUrl, docente, { headers: this.getHeaders() });
  }

  actualizarDocente(id: number, docente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, docente, { headers: this.getHeaders() });
  }

  eliminarDocente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // ======================================================
  // 2. GESTIÓN DE CURSOS Y MÓDULOS
  // ======================================================

  getCursosDeDocente(id: number): Observable<any> {
    return this.http.get(`${this.apiBase}/docentes/${id}/mis-cursos`, { headers: this.getHeaders() });
  }

  obtenerDetalleCurso(id: number): Observable<any> {
    return this.http.get(`${this.apiBase}/cursos/detalle/${id}`, { headers: this.getHeaders() });
  }

  getModulosPorCurso(idCurso: number): Observable<any> {
    return this.http.get(`${this.apiBase}/cursos/${idCurso}/modulos`, { headers: this.getHeaders() });
  }

  crearModulo(modulo: any): Observable<any> {
    return this.http.post(`${this.apiBase}/modulos`, modulo, { headers: this.getHeaders() });
  }

  // ======================================================
  // 3. GESTIÓN DE TAREAS (CRUD)
  // ======================================================

  getTareasPorModulo(moduloId: number): Observable<any> {
    return this.http.get(`${this.apiBase}/modulos/${moduloId}/tareas`, { headers: this.getHeaders() });
  }

  crearTarea(tarea: any): Observable<any> {
    return this.http.post(`${this.apiBase}/tareas`, tarea, { headers: this.getHeaders() });
  }

  actualizarTarea(id: number, tarea: any): Observable<any> {
    return this.http.put(`${this.apiBase}/tareas/${id}`, tarea, { headers: this.getHeaders() });
  }

  eliminarTarea(id: number): Observable<any> {
    return this.http.delete(`${this.apiBase}/tareas/${id}`, { headers: this.getHeaders() });
  }

  // ======================================================
  // 4. GESTIÓN DE MATERIALES (CRUD)
  // ======================================================

  crearMaterial(datos: any): Observable<any> {
    return this.http.post(`${this.apiBase}/materiales`, datos, { headers: this.getHeaders() });
  }

  actualizarMaterial(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.apiBase}/materiales/${id}`, datos, { headers: this.getHeaders() });
  }

  eliminarMaterial(id: number): Observable<any> {
    return this.http.delete(`${this.apiBase}/materiales/${id}`, { headers: this.getHeaders() });
  }

  // ======================================================
  // 5. CALIFICACIONES Y ARCHIVOS
  // ======================================================

  getEntregasPorTarea(tareaId: number): Observable<any> {
    return this.http.get(`${this.apiBase}/tareas/${tareaId}/entregas`, { headers: this.getHeaders() });
  }

  calificarEntrega(datos: any): Observable<any> {
    return this.http.post(`${this.apiBase}/entregas/calificar`, datos, { headers: this.getHeaders() });
  }

  subirArchivoFisico(formData: FormData): Observable<any> {
    // 🚀 OJO: Aquí NO se usa getHeaders() porque al enviar archivos (FormData)
    // el navegador debe poner el 'Content-Type' automáticamente con el 'boundary'.
    const token = localStorage.getItem('token');
    return this.http.post(`${this.apiBase}/upload`, formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }

  getEstudiantesCurso(cursoId: number) {
  return this.http.get(`${this.apiBase}/cursos/${cursoId}/estudiantes`, { headers: this.getHeaders() });
  }

  getNotasDetalleEstudiante(cursoId: number, estudianteId: number) {
    return this.http.get(`${this.apiBase}/cursos/${cursoId}/estudiantes/${estudianteId}/notas`, { headers: this.getHeaders() });
  }  

  eliminarModulo(id: number) {
  return this.http.delete(`${this.apiBase}/modulos/${id}`, { headers: this.getHeaders() });
  }
}