import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SalasPage } from '../salas/salas';
import { ConfiguracoesPage } from '../configuracoes/configuracoes';
import { AmigosPage } from '../amigos/amigos';
import { MapaPage } from '../mapa/mapa';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1 = SalasPage;
  tab2 = AmigosPage;
  tab3 = ConfiguracoesPage;

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
