import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { SalasProvider } from '../../providers/salas/salas';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ConfigSalaModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-config-sala-modal',
  templateUrl: 'config-sala-modal.html',
})
export class ConfigSalaModalPage {

  salaKey;
  todosUsuarios;
  souOCriador;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    private salasProvider: SalasProvider,
    public toastCtrl: ToastController) {

    const that = this;

    this.salaKey = navParams.get('keySala');
    this.souOCriador = this.salasProvider.AmITheCreator(this.salaKey).then(function (res) {
      that.souOCriador = res;
    });
  }

  ionViewDidLoad() {
    this.atualizarListaUsuariosABloquear();
  }

  atualizarListaUsuariosABloquear() {
    const that = this;

    this.salasProvider.getArrayAllUsuariosDeUmaSalaSemListener(this.salaKey).then(function (usuarios) {
      that.todosUsuarios = usuarios;
    });
  }

  bloquearUsuarios(usuariosABloquear: any) {
    const that = this;
    usuariosABloquear.forEach(function (usuario) {
      that.salasProvider.alterarBloqueioDeUmUsuarioDeUmaSala(usuario.key, that.salaKey, true);
    });
    this.atualizarListaUsuariosABloquear();
  }

  desbloquearUsuarios(usuariosADesbloquear: any) {
    const that = this;
    usuariosADesbloquear.forEach(function (usuario) {
      that.salasProvider.alterarBloqueioDeUmUsuarioDeUmaSala(usuario.key, that.salaKey, false);
    });
    this.atualizarListaUsuariosABloquear();
  }

  excluirSala() {
    //Remove a sala do DB
    this.salasProvider.remove(this.salaKey);
    this.navCtrl.popToRoot();
  }

  sairDaSala() {
    this.salasProvider.removerUsuarioDaSala(this.salaKey);
    this.viewCtrl.dismiss ({usuarioSaiuDaSala: true});
    // this.navCtrl.popToRoot();
  }

  fecharModal() {
    this.viewCtrl.dismiss();
  }

}
