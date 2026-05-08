import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class ChatComponent implements OnInit {
  modo: 'privado' | 'grupal' = 'privado';
  contactos: any[] = [];
  cursos: any[] = []; // Para el chat grupal
  filtroBusqueda: string = '';
  
  seleccionado: any = null; // Puede ser un Usuario o un Curso
  mensajes: any[] = [];
  nuevoMensaje: string = '';
  miId = localStorage.getItem('id');

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarContactos();
    this.cargarCursos();
  }

  get tokenHeaders() {
    return new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
  }

  cargarContactos() {
    const rol = localStorage.getItem('rol');
    this.http.get(`http://localhost:3000/api/chat/contactos/${this.miId}/${rol}`, { headers: this.tokenHeaders })
      .subscribe((res: any) => this.contactos = res);
  }

  cargarCursos() {
    const id = localStorage.getItem('id');
    this.http.get(`http://localhost:3000/api/cursos/profesor/${id}`, { headers: this.tokenHeaders })
      .subscribe((res: any) => this.cursos = res);
  }

  seleccionarPrivado(user: any) {
  this.modo = 'privado';
  this.seleccionado = user;
  
  // 1. Traer mensajes
  this.http.get(`http://localhost:3000/api/chat/privado/${this.miId}/${user.id}`, { headers: this.tokenHeaders })
    .subscribe((res: any) => this.mensajes = res);

  // 2. 🚀 Marcar como leídos en la DB
  this.http.post(`http://localhost:3000/api/chat/marcar-leidos`, 
    { remitente_id: user.id, receptor_id: this.miId }, 
    { headers: this.tokenHeaders }
  ).subscribe(() => {
    // Esto disparará la limpieza en la próxima vuelta del polling del header
  });
}

  seleccionarGrupal(curso: any) {
    this.modo = 'grupal';
    this.seleccionado = curso;
    this.http.get(`http://localhost:3000/api/chat/grupal/${curso.id}`, { headers: this.tokenHeaders })
      .subscribe((res: any) => this.mensajes = res);
  }

  enviar() {
    if (!this.nuevoMensaje.trim()) return;
    
    const url = this.modo === 'privado' ? 'enviar-privado' : 'enviar-grupal';
    const payload = this.modo === 'privado' 
      ? { remitente_id: this.miId, receptor_id: this.seleccionado.id, mensaje: this.nuevoMensaje }
      : { curso_id: this.seleccionado.id, remitente_id: this.miId, mensaje: this.nuevoMensaje };

    this.http.post(`http://localhost:3000/api/chat/${url}`, payload, { headers: this.tokenHeaders }).subscribe(() => {
      this.nuevoMensaje = '';
      this.modo === 'privado' ? this.seleccionarPrivado(this.seleccionado) : this.seleccionarGrupal(this.seleccionado);
    });
  }

  get contactosFiltrados() {
    return this.contactos.filter(c => c.nombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase()));
  }
}