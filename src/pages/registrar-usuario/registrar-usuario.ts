import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from '../../models/user';
import { UsuarioProvider } from '../../providers/usuario/usuario';
/**
 * Generated class for the RegistroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registrar-usuario',
  templateUrl: 'registrar-usuario.html',
})
export class RegistrarUsuarioPage {

  user = { email: 'h@h.com', senha: '123456' } as User;

  constructor(
    private usuarioProvider: UsuarioProvider, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
  }

  register(usuario: User) {
    const that = this;
    this.usuarioProvider.registrarNovoUsuario(usuario).then(function (res) {
      const toast = that.toastCtrl.create({
        message: 'Usuário cadastrado com sucesso!',
        duration: 3000
      });
      toast.present();
      that.navCtrl.popToRoot();
    }).catch(function (error) {
      console.log(error);
    });



  }

}
