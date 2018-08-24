import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistrarSalaPage } from './registrar-sala';

@NgModule({
  declarations: [
    RegistrarSalaPage,
  ],
  imports: [
    IonicPageModule.forChild(RegistrarSalaPage),
  ],
})
export class RegistrarSalaPageModule {}
