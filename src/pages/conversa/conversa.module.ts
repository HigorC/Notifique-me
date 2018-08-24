import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConversaPage } from './conversa';

@NgModule({
  declarations: [
    ConversaPage,
  ],
  imports: [
    IonicPageModule.forChild(ConversaPage),
  ],
})
export class ConversaPageModule {}
