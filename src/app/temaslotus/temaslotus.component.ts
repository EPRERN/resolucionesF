import { Component, OnInit } from '@angular/core';
import { TemaslotusService, TtemasLotus } from './temaslotus.service';

@Component({
  selector: 'app-temaslotus',
  templateUrl: './temaslotus.component.html',
  styleUrls: ['./temaslotus.component.css']
})
export class TemaslotusComponent implements OnInit {

  temasLotus: TtemasLotus[] = [];
  nuevoTemaLotus: TtemasLotus = { t_temaslotusdescripcion: '' };
  editando: TtemasLotus | null = null;

  constructor(private temasLotusService: TemaslotusService) { }


  ngOnInit() {
    this.cargarTemasLotus();
  }
  cargarTemasLotus(): void {
    this.temasLotusService.getAll().subscribe(data => {
      console.log('Datos recibidos del Backend: ', data);
      this.temasLotus = data;
    })
  }

  agregarTemaLotus(): void {
    if (!this.nuevoTemaLotus.t_temaslotusdescripcion.trim()) return;

    this.temasLotusService.create(this.nuevoTemaLotus).subscribe(() => {
      this.cargarTemasLotus();
      this.nuevoTemaLotus = { t_temaslotusdescripcion: '' };
    });
  }


  editarTemaLotus(tl: TtemasLotus): void {
    this.editando = { ...tl }
  }


  guardarEdicion(): void {
    if (this.editando && this.editando.t_temaslotusid) {
      this.temasLotusService.update(this.editando.t_temaslotusid, this.editando).subscribe(() => {
        this.cargarTemasLotus();
        this.editando = null;
      });
    }
  }

  cancelarEdicion(): void {
    this.editando = null;
  }

  eliminarTemaLotus(id: number): void {
    this.temasLotusService.delete(id).subscribe({
      next: () => {
        this.cargarTemasLotus();
        console.log('se borro');
      },
      error: (err) => {
        if (err.status === 409) {
          alert('No se puede eliminar el tema lotus porque tiene resoluciones asociadas');
        } else {
          alert('Error al eliminar el tema');
        }
      }
    })
  }



}
