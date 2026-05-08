import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common'; 
import { Estudiante } from '../../../services/estudiante';

@Component({
  selector: 'app-estudiante-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estudiante-detalle.html'
})
export class EstudianteDetalle implements OnInit { // 👈 Sin "Component"
  perfil: any = null;

  constructor(
    private route: ActivatedRoute, 
    private service: Estudiante, // 👈 Sin "Service"
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.service.getPerfil(id).subscribe({
      next: (data) => this.perfil = data,
      error: (err) => console.error('Error al cargar perfil:', err)
    });
  }

  // Este es el método que soluciona el error del HTML
  regresar(): void {
    this.location.back();
  }
}