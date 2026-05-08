import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocenteService } from '../../../services/docente';

@Component({
  selector: 'app-docente-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './docente-dashboard.html'
})
export class DocenteDashboard implements OnInit {
  cursos: any[] = [];
  nombreDocente: string = localStorage.getItem('nombre') || 'Catedrático';

  constructor(private service: DocenteService) {}

  ngOnInit(): void {
  const idUsuario = localStorage.getItem('id'); 
  // 🟡 RASTREADOR 3: ¿Qué ID guardó el login en tu compu?
  console.log('🟡 1. Angular sacó del localStorage el ID:', idUsuario);

  if (idUsuario) {
    this.service.getCursosDeDocente(Number(idUsuario)).subscribe({
      next: (res: any) => {
        // 🟡 RASTREADOR 4: ¿Qué le contestó el backend?
        console.log('🟡 2. Angular recibió del backend:', res);
        this.cursos = res;
      },
      error: (err: any) => console.error('🔴 Error de Angular:', err)
    });
  }
}
}