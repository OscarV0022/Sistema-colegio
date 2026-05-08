import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Estudiante {
  private apiUrl = 'http://localhost:3000/api/estudiantes';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  buscarEstudiantes(termino: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/buscar?termino=${termino}`, { headers: this.getHeaders() });
  }

  getPerfil(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/perfil/${id}`, { headers: this.getHeaders() });
  }

  registrar(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, datos, { headers: this.getHeaders() });
  }

  asignarCurso(datos: any): Observable<any> {
    // Asegurate de que la URL coincida con tu backend (localhost:3000/api/estudiantes/asignar)
    return this.http.post('http://localhost:3000/api/estudiantes/asignar', datos, { headers: this.getHeaders() });
  }

  getGrados(): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:3000/api/estudiantes/grados', { headers: this.getHeaders() });
  }

  getByCarnet(carnet: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/buscar/${carnet}`, { headers: this.getHeaders() });
  }

  // Agregamos este para el cambio de grado y asignación automática
  actualizarGrado(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/actualizar-grado`, datos, { headers: this.getHeaders() });
  }
}