import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { User } from '../../models/user';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { TabsPage } from '../tabs/tabs';
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

  // user = { email: 'h@h.com', senha: '123456' } as User;
  user = {};

  constructor(
    private usuarioProvider: UsuarioProvider, public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {

    navParams.get('loading').dismiss();
  }

  register(usuario: User) {
    const that = this;
    let loading = this.loadingCtrl.create({
      content: 'Salvando novo usuário...'
    });

    loading.present();

    this.usuarioProvider.registrarNovoUsuario(usuario).then(function (res) {
      loading.dismiss();
      const toast = that.toastCtrl.create({
        message: 'Usuário cadastrado com sucesso!',
        duration: 3000
      });
      toast.present();

      that.login(usuario);
      // that.navCtrl.popToRoot();
    }).catch(function (error) {
      loading.dismiss();

      switch (error.code) {
        case "auth/wrong-password":
          that.exibirToast('A senha está incorreta!');
          break;
        case "auth/invalid-email":
          that.exibirToast('Este email é inválido!');
          break;
        case "auth/email-already-in-use":
          that.exibirToast('Este email já está em uso!');
          break;
        case "auth/weak-password":
          that.exibirToast('A senha precisa conter no mínimo 6 caracteres!');
          break;

      }

      // console.log(error);
      console.error(error);
      
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
    })
  }

  cancelar() {
    this.navCtrl.popToRoot();
  }

}
