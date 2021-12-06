import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 
import { IonicModule } from '@ionic/angular';
 
import { MedicamentoPageRoutingModule } from './medicamento-routing.module';
 
import { MedicamentoPage } from './medicamento.page';
import { PagoModalComponent } from '../../components/pago-modal/pago-modal.component';
import { DirectivesModule } from '../../../shared/directives/directives.module';
import { Stripe } from '@ionic-native/stripe/ngx';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicamentoPageRoutingModule,
    ReactiveFormsModule,
    DirectivesModule
  ],
  declarations: [MedicamentoPage, PagoModalComponent],
  providers: [Stripe]
})
export class MedicamentoPageModule {}
