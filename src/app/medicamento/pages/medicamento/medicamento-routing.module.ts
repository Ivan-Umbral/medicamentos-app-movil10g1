import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
 
import { MedicamentoPage } from './medicamento.page';
 
const routes: Routes = [
  {
    path: '',
    component: MedicamentoPage,
  }
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicamentoPageRoutingModule {}
