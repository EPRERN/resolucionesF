import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-cargador',
  templateUrl: './dashboard-cargador.component.html',
  styleUrls: ['./dashboard-cargador.component.css']
})
export class DashboardCargadorComponent {

  constructor(private route:Router){}

  irAResoluciones(){
    this.route.navigate(['/resoluciones'])
  }

  verResoluciones(){
    this.route.navigate(['/carga-resoluciones'])
  }
}
