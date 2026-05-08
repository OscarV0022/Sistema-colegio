import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-curso-alumnos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './curso-alumnos.html',
  styleUrl: '../../docente/curso-gestion/curso-gestion.css'
})
export class CursoAlumnos implements OnInit {
  cursoId: string = '';
  nombreCurso: string = 'Cargando...';
  unidades: any[] = [];
  unidadSeleccionada: any = null;
  actividades: any[] = [];
  videoSeleccionado: any = null;
  
  tareaParaEntregar: any = null;
  archivoSeleccionado: File | null = null;
  
  justificacion: string = '';
  accionModificar: 'editar' | 'eliminar' = 'editar';

  // 🚀 NUEVAS VARIABLES PARA EL RESUMEN DE NOTAS
  vistaActual: string = 'unidad'; 
  notasResumen: any[] = [];
  totalZona: number = 0;
  totalExamenes: number = 0;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cursoId = this.route.snapshot.paramMap.get('id') || '';
    if (this.cursoId) {
      this.cargarUnidades();
    }
  }

  cargarUnidades() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(`http://localhost:3000/api/cursos/${this.cursoId}/modulos`, { headers }).subscribe({
      next: (res: any) => {
        this.unidades = res;
        if (this.unidades.length > 0) {
          this.seleccionarUnidad(this.unidades[0]);
        }
      },
      error: (err) => console.error("Error al cargar unidades", err)
    });
  }

  // 🚀 FUNCIÓN ACTUALIZADA: Asegura que se vuelva a la vista de unidad
  seleccionarUnidad(unidad: any) {
    this.vistaActual = 'unidad';
    this.unidadSeleccionada = unidad;
    this.videoSeleccionado = null;
    const estudianteId = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(`http://localhost:3000/api/tareas/estado/${unidad.id}/${estudianteId}`, { headers }).subscribe({
      next: (res: any) => { this.actividades = res; },
      error: (err) => { console.error("Error al cargar actividades:", err); }
    });
  }

  // 🚀 NUEVA FUNCIÓN: Obtiene las notas y calcula 40/60
  verMisCalificaciones() {
    this.vistaActual = 'calificaciones';
    this.unidadSeleccionada = null;
    this.videoSeleccionado = null;

    const estudianteId = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Nota: Asegúrate de que esta URL sea la misma que usa el docente para ver las notas
    this.http.get(`http://localhost:3000/api/cursos/${this.cursoId}/estudiantes/${estudianteId}/notas`, { headers }).subscribe({
      next: (res: any) => {
        this.notasResumen = res;
        
        // Sumatoria 40/60
        this.totalZona = res.filter((n: any) => n.es_examen === 0).reduce((s: number, n: any) => s + (Number(n.nota_obtenida) || 0), 0);
        this.totalExamenes = res.filter((n: any) => n.es_examen === 1).reduce((s: number, n: any) => s + (Number(n.nota_obtenida) || 0), 0);
      },
      error: (err) => console.error("Error al cargar mis notas", err)
    });
  }

  getIconConfig(act: any) {
    if (act.tipo === 'material') {
      if (act.archivo_url?.includes('youtube.com')) return { icon: 'bi-youtube', color: 'text-danger' };
      if (act.archivo_url?.endsWith('.pdf')) return { icon: 'bi-file-earmark-pdf-fill', color: 'text-danger' };
      return { icon: 'bi-file-earmark-text-fill', color: 'text-primary' };
    }
    return { icon: 'bi-journal-check', color: 'text-success' };
  }

  verRecurso(act: any) {
    if (act.tipo === 'material' && act.archivo_url?.includes('youtube.com')) {
      this.videoSeleccionado = act;
    } else if (act.archivo_url) {
      window.open(`http://localhost:3000${act.archivo_url}`, '_blank');
    }
  }

  getSafeVideoUrl(url: string): SafeResourceUrl {
    const videoId = url.split('v=')[1]?.split('&')[0];
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  onFileSelected(event: any) {
    this.archivoSeleccionado = event.target.files[0];
  }

  prepararEntrega(tarea: any) {
    this.tareaParaEntregar = tarea;
    this.archivoSeleccionado = null;
  }

  abrirModificar(tarea: any) {
    this.tareaParaEntregar = tarea;
    this.justificacion = '';
    this.archivoSeleccionado = null;
    this.accionModificar = 'editar';
  }

  enviarTarea() {
    if (!this.archivoSeleccionado && this.tareaParaEntregar.formato_entrega !== 'texto') { 
      alert('Selecciona un archivo primero'); 
      return; 
    }
    const studentId = localStorage.getItem('id');
    const formData = new FormData();
    if (this.archivoSeleccionado) formData.append('archivoPdf', this.archivoSeleccionado);
    formData.append('estudiante_id', studentId!);
    formData.append('tarea_id', this.tareaParaEntregar.id);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post('http://localhost:3000/api/tareas/entregar', formData, { headers }).subscribe({
      next: () => {
        alert('¡Tarea entregada con éxito! 🎉');
        this.tareaParaEntregar = null;
        this.seleccionarUnidad(this.unidadSeleccionada);
      },
      error: () => alert('Error al subir la tarea.')
    });
  }

  confirmarModificacion() {
    if (!this.justificacion.trim()) {
      alert('⚠️ Debes escribir la razón del cambio para que el profesor la vea.');
      return;
    }
    if (this.accionModificar === 'editar' && !this.archivoSeleccionado) {
      alert('⚠️ Selecciona el nuevo archivo a subir.');
      return;
    }

    const formData = new FormData();
    formData.append('entrega_id', this.tareaParaEntregar.entrega_id);
    formData.append('accion', this.accionModificar);
    formData.append('comentario_alumno', this.justificacion);

    if (this.accionModificar === 'editar' && this.archivoSeleccionado) {
      formData.append('archivoPdf', this.archivoSeleccionado);
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post('http://localhost:3000/api/tareas/entrega/modificar', formData, { headers }).subscribe({
      next: () => {
        alert(this.accionModificar === 'eliminar' ? 'Entrega anulada correctamente.' : 'Entrega actualizada con éxito.');
        this.seleccionarUnidad(this.unidadSeleccionada);
      },
      error: (err) => alert(err.error?.error || 'Error al procesar la solicitud.')
    });
  }
}