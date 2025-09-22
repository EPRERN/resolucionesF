import { Component, OnInit } from '@angular/core';
import { T_temas } from './temas.model';
import { TemasService } from './temas.service';
import { TtemasLotus } from '../temaslotus/temaslotus.model';
import { TemaslotusService } from '../temaslotus/temaslotus.service';

@Component({
  selector: 'app-temas',
  templateUrl: './temas.component.html',
  styleUrls: ['./temas.component.css']
})
export class TemasComponent implements OnInit {

  temas: T_temas[] = [];
  temasLotus: TtemasLotus[] = [];
  nuevoTema: T_temas = {
    t_temasdescripcion: '',
    temasLotus: { t_temaslotusid: 0 }
  };
  editando: T_temas | null = null;


  constructor(private temasService: TemasService, private temasLotusService: TemaslotusService) { }


  ngOnInit() {
    this.cargarTemas();
    this.cargarTemasLotus();
  }
  cargarTemas() {
    this.temasService.getAll().subscribe(data => {
      console.log('datos del back: ', data);
      this.temas = data;
    })
  }

  cargarTemasLotus() {
    this.temasLotusService.getAll().subscribe(data => this.temasLotus = data);
  }


  agregarTema(): void {
    if (!this.nuevoTema.t_temasdescripcion.trim() || !this.nuevoTema.temasLotus) return;

    this.temasService.create(this.nuevoTema).subscribe(() => {
      this.cargarTemas();
      this.nuevoTema = {
        t_temasdescripcion: '',
        temasLotus: { t_temaslotusid: 0 }
      };
    });
  }


  editarTema(tl: T_temas): void {
    this.editando = { ...tl }
  }

  guardarEdicion(): void {
    if (this.editando && this.editando.t_temasid) {
      this.temasService.update(this.editando.t_temasid, this.editando).subscribe(() => {
        this.cargarTemas();
        this.editando = null;
      })
    }
  }



  cancelarEdicion(): void {
    this.editando = null;
  }

  eliminarTema(id: number): void {
    this.temasService.delete(id).subscribe({
      next: () => {
        this.cargarTemas();
      },
      error: (err) => {
        if (err.status === 409) {
          alert('No se puede eliminar el tema porque tiene resoluciones asociadas');
        } else {
          alert('Error al eliminar el tema');
        }
      }
    })
  }

}
