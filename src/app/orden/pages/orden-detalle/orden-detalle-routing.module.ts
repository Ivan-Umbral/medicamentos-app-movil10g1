import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdenDetallePage } from './orden-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: OrdenDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdenDetallePageRoutingModule {}
