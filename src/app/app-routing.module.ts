import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { DistribuidorasComponent } from './distribuidoras/distribuidoras.component';
import { ResolucionesComponent } from './resoluciones/resoluciones.component';
import { TemasComponent } from './temas/temas.component';
import { TemaslotusComponent } from './temaslotus/temaslotus.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'distribuidoras', component: DistribuidorasComponent, canActivate: [AuthGuard] },
  { path: 'resoluciones', component: ResolucionesComponent, canActivate: [AuthGuard] },
  { path: 'temas', component: TemasComponent, canActivate: [AuthGuard] },
  { path: 'temaslotus', component: TemaslotusComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
