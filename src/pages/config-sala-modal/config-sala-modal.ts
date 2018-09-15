import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { SalasProvider } from '../../providers/salas/salas';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    private salasProvider: SalasProvider,
    public toastCtrl: ToastController) {

    this.salaKey = navParams.get('keySala');

    const that = this;

    this.salasProvider.getArrayAllUsuariosKeysDeUmaSalaSemListener(this.salaKey).then(function (usuarios) {
      console.log(usuarios);
      that.todosUsuarios = usuarios;

    });


    // this.salasProvider.getAllUsuariosDeUmaSalaSemListener(this.salaKey).then(function (usuarios) {
    //   console.log(usuarios.val());
    //   that.todosUsuarios = usuarios.val();
    // });
  }

  compareFn(e1: any, e2: any): boolean {
    return e1 && e2 ? e1.bloqueado === e2.bloqueado : e1 === e2;
  }

  excluirSala() {
    //Remove a sala do DB
    this.salasProvider.remove(this.salaKey);
    this.navCtrl.popToRoot();
  }

  fecharModal() {
    this.viewCtrl.dismiss();
  }

}
