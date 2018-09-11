import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { RegistrarSalaPage } from '../registrar-sala/registrar-sala';
import { SalasProvider } from '../../providers/salas/salas';
import { Observable } from 'rxjs/Observable';
import { ConversaPage } from '../conversa/conversa';

/**
 * Generated class for the SalasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-salas',
  templateUrl: 'salas.html',
})
export class SalasPage {
  salas: Observable<any>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private salasProvider: SalasProvider) {
    this.salas = this.salasProvider.getAll();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SalasPage');
  }

  novaSala() {
    let profileModal = this.modalCtrl.create(RegistrarSalaPage);
    profileModal.present();

    profileModal.onDidDismiss(data => {
      console.log(data);
    });
  }

  entrarNaSala(sala) {
    let conversaModal = this.modalCtrl.create(ConversaPage, {salaKey:sala.key});
    conversaModal.present();

    conversaModal.onDidDismiss(data => {
      console.log(data);
    });
  }

}
