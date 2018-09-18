import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { UsuarioProvider } from '../../providers/usuario/usuario';

/**
 * Generated class for the AdicionarAmigoModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adicionar-amigo-modal',
  templateUrl: 'adicionar-amigo-modal.html',
})
export class AdicionarAmigoModalPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private usuarioProvider: UsuarioProvider) {
  }

  adicionarAmigo(emailAmigo) {
    console.log(emailAmigo);
    this.usuarioProvider.enviarConviteAmizade(emailAmigo);

    // sala.criador = this.usuarioProvider.getEmailUsuarioAtual();
    // this.salasProvider.save(sala);
    // this.viewCtrl.dismiss();
  }

  fecharModal() {
    this.viewCtrl.dismiss();
  }

}
