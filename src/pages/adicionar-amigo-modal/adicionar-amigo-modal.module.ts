import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdicionarAmigoModalPage } from './adicionar-amigo-modal';

@NgModule({
  declarations: [
    AdicionarAmigoModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AdicionarAmigoModalPage),
  ],
})
export class AdicionarAmigoModalPageModule {}
