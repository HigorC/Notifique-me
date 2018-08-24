import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AmigosPage } from './amigos';

@NgModule({
  declarations: [
    AmigosPage,
  ],
  imports: [
    IonicPageModule.forChild(AmigosPage),
  ],
})
export class AmigosPageModule {}
