import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdenDetallePageRoutingModule } from './orden-detalle-routing.module';

import { OrdenDetallePage } from './orden-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdenDetallePageRoutingModule
  ],
  declarations: [OrdenDetallePage]
})
export class OrdenDetallePageModule {}
