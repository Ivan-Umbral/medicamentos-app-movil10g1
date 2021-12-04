import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
import { IonicModule } from '@ionic/angular';
 
import { MedicamentoPageRoutingModule } from './medicamento-routing.module';
 
import { MedicamentoPage } from './medicamento.page';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicamentoPageRoutingModule
  ],
  declarations: [MedicamentoPage]
})
export class MedicamentoPageModule {}
