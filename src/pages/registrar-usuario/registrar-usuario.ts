import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  user = {} as User;

  constructor(
    private usuarioProvider: UsuarioProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  register(usuario: User) {
    this.usuarioProvider.registrarNovoUsuario(usuario);
  }

}
