import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { DocenteService } from '../../../services/docente';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-curso-gestion',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], 
  templateUrl: './curso-gestion.html',
  styleUrls: ['./curso-gestion.css'] 
})
export class CursoGestionD implements OnInit {
  cursoId: number = 0;
  nombreCurso: string = 'Cargando curso...'; 
  unidades: any[] = [];
  unidadSeleccionada: any = null;
  actividades: any[] = []; 

  // 🚀 CONTROL DE VISTAS
  vistaActual: string = 'unidad'; 

  // 🚀 VARIABLES PARA REPORTES
  estudiantes: any[] = [];
  alumnoSeleccionado: any = null;
  notasDetalle: any[] = [];
  
  // Totales para la lógica 40/60
  totalZona: number = 0;
  totalExamenes: number = 0;

  // 🚀 VARIABLES DE ESTADO
  tareaSeleccionada: any = null; 
  videoSeleccionado: any = null;
  entregas: any[] = [];         
  editandoId: number | null = null;
  archivoSeleccionado: File | null = null;

  actividadForm = {
    titulo: '', descripcion: '', fecha_expiracion: '',
    ponderacion: 0, tipo: 'tarea', formato_entrega: 'pdf' 
  };

  constructor(
    private route: ActivatedRoute,
    private docenteService: DocenteService,
    private sanitizer: DomSanitizer 
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.cursoId = Number(idParam);
      this.docenteService.obtenerDetalleCurso(this.cursoId).subscribe({
        next: (res: any) => this.nombreCurso = res.nombre_curso || `Curso #${this.cursoId}`,
        error: (err: any) => console.error('Error al cargar nombre:', err)
      });
      this.cargarUnidades();
    }
  }

  cargarUnidades() {
    this.docenteService.getModulosPorCurso(this.cursoId).subscribe({
      next: (res: any) => {
        this.unidades = res;
        if (this.unidades.length > 0 && !this.unidadSeleccionada) {
          this.seleccionarUnidad(this.unidades[0]);
        }
      }
    });
  }

  seleccionarUnidad(unidad: any) {
    this.vistaActual = 'unidad';
    this.unidadSeleccionada = unidad;
    this.tareaSeleccionada = null; 
    this.videoSeleccionado = null;
    this.actividades = []; 
    if (unidad && unidad.id) {
      this.docenteService.getTareasPorModulo(unidad.id).subscribe({
        next: (res: any) => this.actividades = res
      });
    }
  }

  // ==========================================
  // 🚀 REPORTES Y NOTAS (LOGICA 40/60)
  // ==========================================
  verEstudiantes() {
    this.vistaActual = 'estudiantes';
    this.docenteService.getEstudiantesCurso(this.cursoId).subscribe({
      next: (res: any) => this.estudiantes = res
    });
  }

  verCalificaciones() {
    this.vistaActual = 'calificaciones';
    this.docenteService.getEstudiantesCurso(this.cursoId).subscribe({
      next: (res: any) => this.estudiantes = res
    });
  }

  verDetalleAlumno(alumno: any) {
  this.alumnoSeleccionado = alumno;
  this.vistaActual = 'detalle-alumno';
  this.docenteService.getNotasDetalleEstudiante(this.cursoId, alumno.id).subscribe({
    next: (res: any) => {
      this.notasDetalle = res;
      // n.es_examen ahora viene de la tabla modulos
      this.totalZona = res.filter((n:any) => n.es_examen === 0).reduce((s:number, n:any) => s + (Number(n.nota_obtenida)||0), 0);
      this.totalExamenes = res.filter((n:any) => n.es_examen === 1).reduce((s:number, n:any) => s + (Number(n.nota_obtenida)||0), 0);
    }
  });
}
  // ==========================================
  // 🎥 GESTIÓN DE EXÁMENES RÁPIDOS
  // ==========================================
  crearExamenRapido() {
  const nombre = prompt('Nombre del Contenedor de Examen (ej. Parcial I):');
  if (!nombre) return;

  const payload = {
    curso_id: this.cursoId,
    nombre_modulo: nombre.trim(),
    es_examen: 1, // 👈 Se guarda como módulo de examen
    orden: this.unidades.length + 1
  };

  // Usamos el servicio de crear modulo pero mandando el campo es_examen
  this.docenteService.crearModulo(payload).subscribe({
    next: () => {
      alert('¡Contenedor de examen creado!');
      this.cargarUnidades();
    },
    error: (err) => alert(err.error?.error || 'Ya no puedes crear más exámenes.')
  });
}

  // ==========================================
  // 📂 LÓGICA DE ARCHIVOS Y MULTIMEDIA
  // ==========================================
  getSafeVideoUrl(url: string): SafeResourceUrl {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube-nocookie.com/embed/${videoId}`);
  }

  gestionarArchivo(act: any) {
    if (!act.archivo_url) return;
    if (act.archivo_url.includes('youtube.com') || act.archivo_url.includes('youtu.be')) {
      this.videoSeleccionado = act;
      this.tareaSeleccionada = null;
      return;
    }
    const urlCompleta = `http://localhost:3000${act.archivo_url}`;
    const extension = act.archivo_url.toLowerCase().split('.').pop();
    if (extension === 'pdf') {
      window.open(urlCompleta, '_blank');
    } else {
      if (confirm(`¿Deseas descargar "${act.titulo}"?`)) {
        const link = document.body.appendChild(document.createElement('a'));
        link.href = urlCompleta; link.download = act.titulo; link.click(); link.remove();
      }
    }
  }

  // ==========================================
  // 🚀 CRUD ACTIVIDADES
  // ==========================================
  prepararModal(tipo: string) {
    this.editandoId = null; this.archivoSeleccionado = null;
    this.actividadForm = { titulo: '', descripcion: '', fecha_expiracion: '', ponderacion: 0, tipo: tipo, formato_entrega: 'pdf' };
  }

  editarActividad(act: any) {
    this.editandoId = act.id;
    this.archivoSeleccionado = null; 
    let fechaLocal = act.fecha_expiracion ? new Date(act.fecha_expiracion).toISOString().substring(0, 16) : '';
    this.actividadForm = {
      titulo: act.titulo, descripcion: act.descripcion || '', tipo: act.tipo,
      ponderacion: act.ponderacion || 0, formato_entrega: act.formato_entrega || 'pdf', fecha_expiracion: fechaLocal
    };
  }

  eliminarActividad(act: any) {
    if (!confirm(`¿Borrar definitivamente "${act.titulo}"?`)) return;
    const obs = act.tipo === 'tarea' ? this.docenteService.eliminarTarea(act.id) : this.docenteService.eliminarMaterial(act.id);
    obs.subscribe({ next: () => { alert('Eliminado'); this.seleccionarUnidad(this.unidadSeleccionada); } });
  }

  guardarActividad() {
    if (!this.actividadForm.titulo.trim()) return alert('Título obligatorio');
    if (this.actividadForm.tipo === 'material' && this.actividadForm.descripcion.includes('youtu')) {
      this.finalizarGuardadoDB(this.actividadForm.descripcion.trim());
    } else if (this.archivoSeleccionado) {
      const formData = new FormData(); formData.append('archivoPdf', this.archivoSeleccionado);
      this.docenteService.subirArchivoFisico(formData).subscribe({ next: (res: any) => this.finalizarGuardadoDB(res.url) });
    } else {
      this.finalizarGuardadoDB(this.editandoId ? this.actividades.find(a => a.id === this.editandoId)?.archivo_url : null);
    }
  }

  private finalizarGuardadoDB(urlArchivo: string | null) {
    const esTarea = this.actividadForm.tipo === 'tarea';
    const payload = {
      curso_id: this.cursoId, modulo_id: this.unidadSeleccionada.id,
      titulo: this.actividadForm.titulo.trim(), descripcion: this.actividadForm.descripcion.trim(),
      archivo_url: urlArchivo, tipo: this.actividadForm.tipo,
      fecha_expiracion: this.actividadForm.fecha_expiracion ? this.actividadForm.fecha_expiracion.replace('T', ' ') + ':00' : null,
      ponderacion: this.actividadForm.ponderacion, formato_entrega: this.actividadForm.formato_entrega
    };
    const obs = this.editandoId 
      ? (esTarea ? this.docenteService.actualizarTarea(this.editandoId, payload) : this.docenteService.actualizarMaterial(this.editandoId, payload))
      : (esTarea ? this.docenteService.crearTarea(payload) : this.docenteService.crearMaterial(payload));
    obs.subscribe({ next: () => { this.seleccionarUnidad(this.unidadSeleccionada); this.limpiarCierre(); }, error: (e) => alert(e.error?.error) });
  }

  verEntregas(act: any) {
    this.tareaSeleccionada = act; this.videoSeleccionado = null;
    this.docenteService.getEntregasPorTarea(act.id).subscribe({ next: (res: any) => this.entregas = res });
  }

  guardarNota(entrega: any) {
    if (entrega.nota > this.tareaSeleccionada.ponderacion) return alert(`Máximo ${this.tareaSeleccionada.ponderacion} pts.`);
    this.docenteService.calificarEntrega({ entrega_id: entrega.id, nota: entrega.nota, comentario_profesor: entrega.comentario_profesor }).subscribe({ next: () => alert('Nota guardada') });
  }

  getIconConfig(act: any) {
    if (act.tipo === 'tarea') return { icon: 'bi-journal-check', color: 'text-success' };
    const url = act.archivo_url?.toLowerCase() || '';
    if (url.includes('youtube')) return { icon: 'bi-youtube', color: 'text-danger' };
    if (url.endsWith('.pdf')) return { icon: 'bi-file-pdf-fill', color: 'text-danger' };
    return { icon: 'bi-file-earmark-text', color: 'text-info' };
  }

  onFileSelected(event: any) { if (event.target.files[0]) this.archivoSeleccionado = event.target.files[0]; }

  crearNuevaUnidad() {
    const n = prompt('Nombre de Unidad:');
    if (n) this.docenteService.crearModulo({ curso_id: this.cursoId, nombre_modulo: n.trim(), orden: this.unidades.length + 1 }).subscribe({ next: () => this.cargarUnidades() });
  }

  borrarModuloActual() {
    if (!this.unidadSeleccionada) return;
    if (confirm(`¿Borrar unidad "${this.unidadSeleccionada.nombre_modulo}"?`)) {
      this.docenteService.eliminarModulo(this.unidadSeleccionada.id).subscribe({ next: () => { this.unidadSeleccionada = null; this.cargarUnidades(); }, error: (e) => alert(e.error?.error) });
    }
  }

  private limpiarCierre() { this.archivoSeleccionado = null; this.editandoId = null; }
}