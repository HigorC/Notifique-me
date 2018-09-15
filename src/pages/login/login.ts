import { Component } from '@angular/core';
import { IonicPage, NavController, UrlSerializer } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { convertUrlToSegments } from 'ionic-angular/umd/navigation/url-serializer';
import { TabsPage } from '../tabs/tabs';
import { UsuarioProvider } from '../../providers/usuario/usuario';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  user = { email: 'a@a.com', senha: '123456' } as User;

  constructor(private afAuth: AngularFireAuth,
    public navCtrl: NavController,
    private usuarioProvider: UsuarioProvider) {

  }

  login(user: User) {
    const that = this;
    this.usuarioProvider.logar(user.email, user.senha).then(function (res) {
      console.log(res);
      that.navCtrl.setRoot(TabsPage);
    }).catch(function (error) {
      console.log(error);
    });
  }

  register() {
    this.navCtrl.push('RegistrarUsuarioPage');
  }

}
