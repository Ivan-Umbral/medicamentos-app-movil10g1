import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
const routes: Routes = [
  /* {
    path: '',
    redirectTo: 'detalle',
    pathMatch: 'full'
  }, */
  {
    path: 'detalle/:id',
    loadChildren: () => import('./pages/medicamento/medicamento.module').then(m => m.MedicamentoPageModule)
  }
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicamentoRoutingModule { }
