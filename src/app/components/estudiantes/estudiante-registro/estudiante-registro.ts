import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Estudiante } from '../../../services/estudiante';
@Component({
  selector: 'app-estudiante-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiante-registro.html'
})
export class EstudianteRegistro implements OnInit {
  // Objeto para el formulario
  nuevo = {
    carnet: '',
    nombre: '',
    edad: null,
    grado_actual: '',
    email: '',
    password: ''
  };

  // Lista dinámica que viene de la DB
  listaGrados: any[] = [];

  constructor(private service: Estudiante) {}

  ngOnInit(): void {
    this.cargarGrados();
  }

  // Traemos los grados únicos que existen en la tabla cursos
  cargarGrados() {
    this.service.getGrados().subscribe({
      next: (res) => {
        this.listaGrados = res;
      },
      error: (err: any) => {
        console.error('Error al traer grados de MariaDB:', err);
      }
    });
  }

  // Método para inscribir y asignar cursos automáticamente
  registrar() {
    this.service.registrar(this.nuevo).subscribe({
      next: (res) => {
        alert(res.message); // El backend dirá cuántos cursos asignó
        this.limpiar();
      },
      error: (err: any) => {
        alert('Clavo en el registro: ' + (err.error?.message || err.message));
      }
    });
  }

  limpiar() {
    this.nuevo = {
      carnet: '',
      nombre: '',
      edad: null,
      grado_actual: '',
      email: '',
      password: ''
    };
  }
}