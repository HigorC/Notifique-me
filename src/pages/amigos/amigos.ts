import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AdicionarAmigoModalPage } from '../adicionar-amigo-modal/adicionar-amigo-modal';
import { UsuarioProvider } from '../../providers/usuario/usuario';

/**
 * Generated class for the AmigosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-amigos',
  templateUrl: 'amigos.html',
})
export class AmigosPage {

  meusConvites;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private usuarioProvider: UsuarioProvider) {

    this.prepararConvites();

  }

  prepararConvites() {
    const that = this;
    this.usuarioProvider.getAllConvites().forEach(function (convites) {
      that.meusConvites = [];
      convites.forEach(function (convite) {
        convite.u.then(function (res) {
          console.log(res);
          that.meusConvites.push(res)
        })
      })
    })
  }

  aceitarConvite() {
    console.log('convite aceito');

  }

  recusarConvite() {
    console.log('convite recusado');

  }

  adicionarAmigo() {
    let profileModal = this.modalCtrl.create(AdicionarAmigoModalPage);
    profileModal.present();

    profileModal.onDidDismiss(data => {
      console.log(data);
    });
  }

}
