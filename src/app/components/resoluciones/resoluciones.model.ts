import { T_distribuidoras } from "../distribuidoras/distribuidoras.model";
import { T_temas } from "../temas/temas.model";

export interface T_resoluciones {
    t_resolucionesid?: number;
    t_resolucionesnro: string;
    distribuidora: T_distribuidoras;
    tema: T_temas;
    t_resolucionesblob?: Uint8Array;
    t_resolucionesexpte: string;
    t_resolucionestitulo: string;
    t_resolucionesexptecaratula: string;
    t_resolucionesdate: Date;
}



