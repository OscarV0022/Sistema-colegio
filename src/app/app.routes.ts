import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { DocenteList } from './components/docente-list/docente-list';
import { CursoGestion } from './components/curso-gestion/curso-gestion'; // Este es el del ADMIN

// Estudiantes (ADMIN)
import { EstudianteDashboard } from './components/estudiantes/estudiante-dashboard/estudiante-dashboard';
import { EstudianteListaComponent } from './components/estudiantes/estudiante-lista/estudiante-lista';
import { EstudianteDetalle } from './components/estudiantes/estudiante-detalle/estudiante-detalle';
import { EstudianteRegistro } from './components/estudiantes/estudiante-registro/estudiante-registro';
import { EstudianteAsignacion } from './components/estudiantes/estudiante-asignacion/estudiante-asignacion';

// 🚀 NUEVOS: Importaciones para el PROFESOR
import { DocenteDashboard } from './components/docente/docente-dashboard/docente-dashboard';
import { CursoGestionD } from './components/docente/curso-gestion/curso-gestion';

import { AlumnoDashboard } from './components/alumnos/dashboard/dashboard';

import { CursoAlumnos } from './components/alumnos/curso-alumnos/curso-alumnos';
import { PerfilComponent } from './components/perfil/perfil';
import { ChatComponent } from './components/chat/chat';

// 🛡️ IMPORTACIÓN DE GUARDIANES
import { authGuard } from './services/auth.guard';
import { loginGuard } from './services/login.guard';

export const routes: Routes = [
    { 
        path: 'login', 
        component: LoginComponent,
        canActivate: [loginGuard] // 👈 Bloquea el acceso al login si ya inició sesión
    },
    
    // 🏛️ RUTAS DEL ADMIN (Protegidas)
    { 
        path: 'dashboard', 
        component: Dashboard, 
        canActivate: [authGuard], 
        data: { roles: ['admin'] } 
    },
    { 
        path: 'docentes', 
        component: DocenteList, 
        canActivate: [authGuard], 
        data: { roles: ['admin'] } 
    },
    { 
        path: 'cursos', 
        component: CursoGestion, 
        canActivate: [authGuard], 
        data: { roles: ['admin'] } 
    },
    { 
        path: 'estudiantes', 
        component: EstudianteDashboard, 
        canActivate: [authGuard], 
        data: { roles: ['admin'] } 
    }, 
    { 
        path: 'estudiantes/registro', 
        component: EstudianteRegistro, 
        canActivate: [authGuard], 
        data: { roles: ['admin'] } 
    },
    { 
        path: 'estudiantes/lista', 
        component: EstudianteListaComponent, 
        canActivate: [authGuard], 
        data: { roles: ['admin'] } 
    },
    { 
        path: 'estudiantes/asignacion', 
        component: EstudianteAsignacion, 
        canActivate: [authGuard], 
        data: { roles: ['admin'] } 
    },
    { 
        path: 'estudiante-detalle/:id', 
        component: EstudianteDetalle, 
        canActivate: [authGuard], 
        data: { roles: ['admin'] } 
    },

    // 👨‍🏫 RUTAS DEL PROFESOR (Protegidas)
    { 
        path: 'docente/dashboard', 
        component: DocenteDashboard, 
        canActivate: [authGuard], 
        data: { roles: ['profesor'] } 
    },
    { 
        path: 'docente/curso/:id', 
        component: CursoGestionD, 
        canActivate: [authGuard], 
        data: { roles: ['profesor'] } 
    },
    {
        path: 'alumno/dashboard',
        component: AlumnoDashboard,
        canActivate: [authGuard],
        data: {roles: ['estudiante']}
    },
    { 
        path: 'alumno/curso/:id', 
        component: CursoAlumnos, 
        canActivate: [authGuard], 
        data: { roles: ['estudiante'] } 
    },
    { 
    path: 'perfil', 
    component: PerfilComponent, 
    canActivate: [authGuard] 
    },
    { 
    path: 'chat', 
    component: ChatComponent, 
    canActivate: [authGuard] // 🛡️ Seguridad para que solo entren logueados
    },
    
    // Comodines
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];