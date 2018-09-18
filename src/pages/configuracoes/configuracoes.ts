import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App } from 'ionic-angular';
import { User } from '../../models/user';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ConfiguracoesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-configuracoes',
  templateUrl: 'configuracoes.html',
})
export class ConfiguracoesPage {

  usuario = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private usuarioProvider: UsuarioProvider, private afAuth: AngularFireAuth,public appCtrl: App) {
    this.usuario = usuarioProvider.getUsuarioAtualSimplificado();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfiguracoesPage');
  }

  deslogar() {
    this.afAuth.auth.signOut();
    this.appCtrl.getRootNav().setRoot(LoginPage);
  }

  salvar() {
    this.usuarioProvider.atualizarUsuario(this.usuario);
  }

}
