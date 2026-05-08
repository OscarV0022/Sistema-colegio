import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // 🚀 Necesario para el *ngIf
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Header], // 🚀 Agregamos CommonModule
  templateUrl: './app.html', // 👈 Cambiamos 'template' por 'templateUrl'
  styleUrl: './app.css'
})
export class AppComponent {
  // Inyectamos el router como público para que app.html pueda leer 'router.url'
  constructor(public router: Router) {}
}