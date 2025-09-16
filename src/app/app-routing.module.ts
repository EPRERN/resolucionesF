import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { DistribuidorasComponent } from './distribuidoras/distribuidoras.component';
import { ResolucionesComponent } from './resoluciones/resoluciones.component';
import { TemasComponent } from './temas/temas.component';
import { TemaslotusComponent } from './temaslotus/temaslotus.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RoleGuard } from './auth/role.guard';
import { DashboardCargadorComponent } from './pages/dashboard-cargador/dashboard-cargador.component';
import { ResolucionesyearComponent } from './resolucionesyear/resolucionesyear.component';
import { CargaResolucionesComponent } from './resoluciones/carga-resoluciones/carga-resoluciones.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // Solo ADMINISTRADOR puede entrar a estas rutas
  { path: 'dashboard', component: DashboardComponent, canActivate: [RoleGuard], data: { role: 'ADMINISTRADOR' } },
  { path: 'distribuidoras', component: DistribuidorasComponent, canActivate: [RoleGuard], data: { role: 'ADMINISTRADOR' } },
  { path: 'temas', component: TemasComponent, canActivate: [RoleGuard], data: { role: 'ADMINISTRADOR' } },
  { path: 'temaslotus', component: TemaslotusComponent, canActivate: [RoleGuard], data: { role: 'ADMINISTRADOR' } },
  {path:'resolucionesyear', component:ResolucionesyearComponent, canActivate:[RoleGuard], data:{role:'ADMINISTRADOR'}},

  // Solo CARGADOR_RESOLUCIONES puede entrar a esta ruta
  { path: 'dashboard-cargador', component: DashboardCargadorComponent, canActivate: [RoleGuard], data: { role: 'CARGADOR_RESOLUCIONES' } },
  {path:'resoluciones', component:ResolucionesComponent, canActivate: [RoleGuard], data:{role: 'CARGADOR_RESOLUCIONES'}},
  {path:'carga-resoluciones', component:CargaResolucionesComponent, canActivate:[RoleGuard], data:{role:'CARGADOR_RESOLUCIONES'}},
  // Ruta por defecto
  { path: '', redirectTo: '/login',pathMatch:'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
