import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdenesPageRoutingModule } from './ordenes-routing.module';

import { OrdenesPage } from './ordenes.page';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdenesPageRoutingModule
  ],
  declarations: [OrdenesPage, TimeAgoPipe]
})
export class OrdenesPageModule {}
