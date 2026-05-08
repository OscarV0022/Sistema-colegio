import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // 👈 Importante para navegar

@Component({
  selector: 'app-estudiante-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule], // 👈 Agregalo aquí
  templateUrl: './estudiante-dashboard.html',
  styleUrl: './estudiante-dashboard.css'
})
export class EstudianteDashboard { // 👈 Quitale el "Component" que le pone la CLI
}