import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { DocenteService } from '../../services/docente';

@Component({
  selector: 'app-docente-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './docente-list.html',
})
export class DocenteList implements OnInit {
  docentes: any[] = [];
  cursosDelDocente: any[] = [];
  docenteAEliminar: any = null;
  esEdicion = false;
  idSeleccionado: number | null = null;
  
  nuevoDocente = { carnet: '', nombre: '', email: '', password: '', rol: 'profesor' };

  constructor(private docenteService: DocenteService) {}

  ngOnInit(): void {
    this.cargarDocentes();
  }

  // 1. Carga solo los docentes activos (el filtro viene del Backend)
  cargarDocentes() {
    this.docenteService.getDocentes().subscribe({
      next: (data) => {
        this.docentes = data;
      },
      error: (err: any) => console.error('Error al cargar docentes:', err)
    });
  }

  // 2. Prepara la "baja" consultando la carga académica actual
  prepararEliminacion(docente: any) {
    this.docenteAEliminar = docente;
    this.cursosDelDocente = [];
    
    this.docenteService.getCursosDeDocente(docente.id).subscribe({
      next: (cursos) => {
        this.cursosDelDocente = cursos;
        console.log('Validando carga académica antes de desactivar...');
      },
      error: (err: any) => console.error('Error al obtener cursos:', err)
    });
  }

  // 3. Ejecuta el "Borrado Lógico"
  confirmarEliminacion() {
    if (this.docenteAEliminar) {
      // Aunque el método se llame eliminarDocente, tu backend ahora hace un UPDATE activo=0
      this.docenteService.eliminarDocente(this.docenteAEliminar.id).subscribe({
        next: () => {
          alert('¡El docente ha sido desactivado del sistema!');
          this.cargarDocentes(); // Refresca la tabla (ya no aparecerá)
        },
        error: (err: any) => {
          console.error('Clavo al desactivar:', err);
          alert('Error: El docente no pudo ser desactivado.');
        }
      });
    }
  }

  // Lógica de Guardar (Sigue igual)
  guardarDocente() {
    if (this.esEdicion && this.idSeleccionado) {
      this.docenteService.actualizarDocente(this.idSeleccionado, this.nuevoDocente).subscribe({
        next: () => {
          alert('¡Datos actualizados correctamente!');
          this.cargarDocentes();
        },
        error: () => alert('Error al actualizar')
      });
    } else {
      this.docenteService.crearDocente(this.nuevoDocente).subscribe({
        next: () => {
          alert('¡Docente registrado con éxito!');
          this.cargarDocentes();
          this.limpiarForm();
        },
        error: () => alert('Error al registrar')
      });
    }
  }

  prepararNuevo() {
    this.esEdicion = false;
    this.limpiarForm();
  }

  prepararEdicion(docente: any) {
    this.esEdicion = true;
    this.idSeleccionado = docente.id;
    this.nuevoDocente = { ...docente, password: '' };
  }

  limpiarForm() {
    this.nuevoDocente = { carnet: '', nombre: '', email: '', password: '', rol: 'profesor' };
    this.idSeleccionado = null;
  }
}