import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';


import { LoginComponent } from './auth/login/login.component';
import { DashboardCargadorComponent } from './pages/dashboard-cargador/dashboard-cargador.component';
import { NavComponent } from './pages/nav/nav.component';

import { NavAdminComponent } from './pages/nav-admin/nav-admin.component';
import { DistribuidorasComponent } from './components/distribuidoras/distribuidoras.component';
import { CargaResolucionesComponent } from './components/resoluciones/carga-resoluciones/carga-resoluciones.component';
import { PdfPreviewComponent } from './components/resoluciones/pdf-preview/pdf-preview.component';
import { ResolucionesComponent } from './components/resoluciones/resoluciones.component';
import { ResolucionesyearComponent } from './components/resolucionesyear/resolucionesyear.component';
import { TemasComponent } from './components/temas/temas.component';
import { TemaslotusComponent } from './components/temaslotus/temaslotus.component';


@NgModule({
  declarations: [
    AppComponent,
    ResolucionesComponent,
    TemasComponent,
    TemaslotusComponent,
    ResolucionesyearComponent,
    DistribuidorasComponent,
    PdfPreviewComponent,
    LoginComponent,
    DashboardCargadorComponent,
    NavComponent,
    CargaResolucionesComponent,
    NavAdminComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
