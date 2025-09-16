import { Component, OnInit } from '@angular/core';
import { T_temas } from './temas.model';
import { TemasService } from './temas.service';

@Component({
  selector: 'app-temas',
  templateUrl: './temas.component.html',
  styleUrls: ['./temas.component.css']
})
export class TemasComponent implements OnInit {

  temas: T_temas[] = [];
  nuevoTema: T_temas = { t_temasdescripcion: '' };
  editando: T_temas | null = null

  constructor(private temasService: TemasService) { }


  ngOnInit() {
    this.cargarTemas();
  }
  cargarTemas() {
    this.temasService.getAll().subscribe(data => {
      console.log('datos del back: ', data);
      this.temas = data;
    })
  }


  agregarTema(): void {
    if (!this.nuevoTema.t_temasdescripcion.trim()) return;

    this.temasService.create(this.nuevoTema).subscribe(() => {
      this.cargarTemas();
      this.nuevoTema = { t_temasdescripcion: '' };
    })
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
