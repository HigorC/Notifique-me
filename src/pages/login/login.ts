import { Component } from '@angular/core';
import { IonicPage, NavController, UrlSerializer, LoadingController, AlertController, ToastController, Platform } from 'ionic-angular';
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

  // user = { email: 'a@a.com', senha: '123456' } as User;

  user = { email: '' };

  constructor(private afAuth: AngularFireAuth,
    public navCtrl: NavController,
    private usuarioProvider: UsuarioProvider,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) {

    this.platform.ready().then(() => {
      let emailArmazenado = localStorage.getItem('email');
      let senhaArmazenada = localStorage.getItem('senha');

      if (emailArmazenado) {
        console.log('tem email');
        this.login({ email: emailArmazenado, senha: senhaArmazenada })
      }
    });

  }

  login(user) {
    const that = this;

    let loading = this.loadingCtrl.create({
      content: 'Fazendo login...'
    });

    loading.present();

    this.usuarioProvider.logar(user.email, user.senha).then(function (res) {
      localStorage.setItem('email', user.email);
      localStorage.setItem('senha', user.senha);

      console.log(res);
      loading.dismiss();
      that.navCtrl.setRoot(TabsPage);
    }).catch(function (error) {
      loading.dismiss();

      switch (error.code) {
        case "auth/wrong-password":
          that.exibirToast('A senha está incorreta!');
          break;
        case "auth/user-not-found":
          that.exibirToast('Não existe um usuário com este email!');
          break;
        case "auth/invalid-email":
          that.exibirToast('Este email é inválido!');
          break;
        case "auth/network-request-failed":
          that.exibirToast('Sem conexão!');
          break;
      }
      console.log(error);
    });
  }

  exibirToast(mensagem) {
    const toast = this.toastCtrl.create({
      message: mensagem,
      duration: 4000,
      position: 'top'
    });
    toast.present();
  }


  register() {

    let loading = this.loadingCtrl.create({
      content: 'Carregando...'
    });

    loading.present();

    this.navCtrl.push('RegistrarUsuarioPage', { loading: loading });
  }

}
