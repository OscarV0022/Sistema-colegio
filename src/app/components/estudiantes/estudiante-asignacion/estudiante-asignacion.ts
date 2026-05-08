import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Estudiante } from '../../../services/estudiante';
@Component({
  selector: 'app-estudiante-asignacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiante-asignacion.html'
})
export class EstudianteAsignacion implements OnInit {
  carnetBusqueda: string = '';
  estudiante: any = null;
  listaGrados: any[] = [];
  nuevoGrado: string = '';

  constructor(private service: Estudiante) {}

  ngOnInit(): void {
    this.service.getGrados().subscribe(res => this.listaGrados = res);
  }

  buscar() {
    // Agregamos :any a la respuesta
    this.service.getByCarnet(this.carnetBusqueda).subscribe({
      next: (res: any) => this.estudiante = res, 
      error: (err: any) => {
        alert('Carné no encontrado');
        this.estudiante = null;
      }
    });
  }

  asignar() {
    const datos = {
      estudiante_id: this.estudiante.id,
      nuevo_grado: this.nuevoGrado
    };

    // Agregamos :any a la respuesta y al error
    this.service.actualizarGrado(datos).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.estudiante = null;
        this.carnetBusqueda = '';
        this.nuevoGrado = '';
      },
      error: (err: any) => alert('Error: ' + (err.error?.message || 'Error desconocido'))
    });
  }
}