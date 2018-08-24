import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SalasProvider } from '../../providers/salas/salas';

/**
 * Generated class for the RegistrarSalaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registrar-sala',
  templateUrl: 'registrar-sala.html',
})
export class RegistrarSalaPage {

  sala = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private salasProvider: SalasProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistrarSalaPage');
  }

  salvarSala(nomeSala) {
    this.salasProvider.save(nomeSala);
    this.viewCtrl.dismiss();
  }

  fecharModal() {
    this.viewCtrl.dismiss();
  }

}
