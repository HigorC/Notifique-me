import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalasPage } from './salas';

@NgModule({
  declarations: [
    SalasPage,
  ],
  imports: [
    IonicPageModule.forChild(SalasPage),
  ],

})
export class SalasPageModule {}
