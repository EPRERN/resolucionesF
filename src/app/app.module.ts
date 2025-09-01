import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DistribuidorasComponent } from './distribuidoras/distribuidoras.component';
import { ResolucionesComponent } from './resoluciones/resoluciones.component';

import { TemasComponent } from './temas/temas.component';
import { TemaslotusComponent } from './temaslotus/temaslotus.component';
import { DistribuidorasService } from './distribuidoras/distribuidoras.service';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { ResolucionesyearComponent } from './resolucionesyear/resolucionesyear.component';

@NgModule({
  declarations: [
    AppComponent,
    ResolucionesComponent,
    TemasComponent,
    TemaslotusComponent,
    ResolucionesyearComponent,
    DistribuidorasComponent
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
