import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent implements OnInit {
  usuario: any = {};
  emailEdit: string = '';
  passEdit: string = '';
  fotoFile: File | null = null;
  imgPreview: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Llamamos a la ruta de perfil que creamos en el backend
    this.http.get(`http://localhost:3000/api/perfil/${id}`, { headers }).subscribe({
      next: (res: any) => {
        this.usuario = res;
        this.emailEdit = res.email;
        // Si tiene foto la mostramos, si no una por defecto
        this.imgPreview = res.foto_url ? `http://localhost:3000${res.foto_url}` : 'assets/default-user.png';
      },
      error: (err) => console.error("Error al cargar perfil", err)
    });
  }

  // Lógica para ver la foto antes de subirla
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fotoFile = file;
      const reader = new FileReader();
      reader.onload = () => this.imgPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  guardarCambios() {
    const formData = new FormData();
    formData.append('id', this.usuario.id);
    formData.append('email', this.emailEdit);
    
    if (this.passEdit) formData.append('password', this.passEdit);
    if (this.fotoFile) formData.append('foto', this.fotoFile);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post('http://localhost:3000/api/perfil/update', formData, { headers }).subscribe({
      next: (res: any) => {
        alert('¡Perfil actualizado con éxito! 🎉');
        this.passEdit = ''; // Limpiamos el campo de contraseña
        this.cargarDatos(); // Recargamos para ver los cambios
      },
      error: (err) => alert('Error al actualizar el perfil.')
    });
  }
}