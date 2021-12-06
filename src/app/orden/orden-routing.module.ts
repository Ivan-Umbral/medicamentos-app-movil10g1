import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'all',
    pathMatch: 'full'
  },
  {
    path: 'all/:userId',
    loadChildren: () => import('./pages/ordenes/ordenes.module').then( m => m.OrdenesPageModule)
  },
  {
    path: 'detalle/:userId/:ordenId',
    loadChildren: () => import('./pages/orden-detalle/orden-detalle.module').then( m => m.OrdenDetallePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdenRoutingModule { }
