import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav/sidenav.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    SidenavComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    SidenavComponent,
  ],
})
export class ComponentsModule { }
