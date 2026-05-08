import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Estudiante } from '../../../services/estudiante';

@Component({
  selector: 'app-estudiante-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiante-lista.html'
})
export class EstudianteListaComponent {
  termino: string = '';
  estudiantes: any[] = [];

  constructor(private service: Estudiante, private router: Router) {}

  buscar() {
    if (this.termino.length > 1) {
      this.service.buscarEstudiantes(this.termino).subscribe({
        next: (res) => this.estudiantes = res,
        error: (err) => console.error(err)
      });
    }
  }

  irAlDetalle(id: number) {
    // Esta es la clave: navegamos al componente de detalle pasando el ID
    this.router.navigate(['/estudiante-detalle', id]);
  }
}