import { Component, OnInit, OnDestroy } from '@angular/core'; // 🚀 Agregamos OnDestroy
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // 🚀 Importamos para las peticiones

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit, OnDestroy { // 🚀 Implementamos OnDestroy
  rol: string | null = '';
  totalNoLeidos: number = 0; // 🔴 Variable para el circulito
  pollingChat: any; // 🔄 Referencia para el temporizador

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.rol = localStorage.getItem('rol');
    
    // 1. Ejecutar la revisión de mensajes de una vez al cargar
    this.actualizarContador();

    // 2. 🔄 Configurar el Polling: Revisa cada 10 segundos
    // Esto hace que el circulito aparezca aunque no recargués la página
    this.pollingChat = setInterval(() => {
      this.actualizarContador();
    }, 10000); 
  }

  // 🚀 Limpieza: Si el componente se destruye, matamos el temporizador
  ngOnDestroy(): void {
    if (this.pollingChat) {
      clearInterval(this.pollingChat);
    }
  }

  actualizarContador() {
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    // Si no hay sesión, no buscamos nada
    if (!id || !token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Llamamos a la ruta del backend que cuenta los leido = 0
    this.http.get(`http://localhost:3000/api/chat/no-leidos/${id}`, { headers }).subscribe({
      next: (res: any) => {
        this.totalNoLeidos = res.total;
      },
      error: (err) => {
        // Si el token vence o hay error, podrías manejarlo aquí, 
        // pero para el contador basta con ignorarlo para no llenar la consola.
      }
    });
  }

  logout() {
    if(confirm('¿Seguro que deseas cerrar tu sesión?')) {
      if (this.pollingChat) clearInterval(this.pollingChat); // Paramos el polling
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}