import { Component, OnInit } from '@angular/core';
import { DistribuidorasService, TDistribuidoras } from './distribuidoras.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpHandler } from '@angular/common/http';




@Component({
    selector: 'app-distribuidoras',
    templateUrl: './distribuidoras.component.html',
    styleUrls: ['./distribuidoras.component.css'],

})
export class DistribuidorasComponent implements OnInit {

    distribuidoras: TDistribuidoras[] = [];
    nuevaDistribuidora: TDistribuidoras = { t_distribuidorasnombre: '' };
    editando: TDistribuidoras | null = null;

    constructor(private distribuidorasService: DistribuidorasService) { }

    ngOnInit(): void {
        this.cargarDistribuidoras();
    }

    cargarDistribuidoras(): void {
        // Simulación si tenés servicio
        this.distribuidorasService.getAll().subscribe(data => {
            console.log('Datos recibidos del backend:', data);
            this.distribuidoras = data;
        });
    }



    agregarDistribuidora(): void {
        if (!this.nuevaDistribuidora.t_distribuidorasnombre.trim()) return;

        this.distribuidorasService.create(this.nuevaDistribuidora).subscribe(() => {
            this.cargarDistribuidoras();
            this.nuevaDistribuidora = { t_distribuidorasnombre: '' };
        });
    }


    
    editarDistribuidora(dis: TDistribuidoras): void {
        this.editando = { ...dis };
    }

    guardarEdicion(): void {
        if (this.editando && this.editando.t_distribuidorasid) {
            this.distribuidorasService.update(this.editando.t_distribuidorasid, this.editando).subscribe(() => {
                this.cargarDistribuidoras();
                this.editando = null;
            });
        }
    }

    cancelarEdicion(): void {
        this.editando = null;
    }

    eliminarDistribuidora(id: number): void {
        this.distribuidorasService.delete(id).subscribe({
            next: () => {
                this.cargarDistribuidoras();
                console.log('Se borró');
            },
            error: (err) => {
                if (err.status === 409) {
                    alert('No se puede eliminar la distribuidora porque tiene resoluciones asociadas');
                } else {
                    alert('Error al eliminar la distribuidora');
                }
            }
        });
    }


}
