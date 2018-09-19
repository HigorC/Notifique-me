import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { identifierModuleUrl } from '@angular/compiler';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController, private usuarioProvider: UsuarioProvider) {
  }

  adicionarAmigo(emailAmigo) {
    const that = this;
    if (emailAmigo) {
      if (emailAmigo !== this.usuarioProvider.getEmailUsuarioAtual()) {
        this.usuarioProvider.enviarConviteAmizade(emailAmigo).then(function (res) {
          console.log(res);

          if (res) {
            const toast = that.toastCtrl.create({
              message: 'Convite enviado!',
              duration: 2000
            });
            toast.present();
            that.fecharModal();
          } else {
            const toast = that.toastCtrl.create({
              message: 'Acho que este email está errado...',
              duration: 2000
            });
            toast.present();
          }

        }).catch(function (err) {
          // console.error(err);
          const toast = that.toastCtrl.create({
            message: 'Ops, algo deu errado. ' + err.message,
            duration: 3000
          });
          toast.present();
        });
      } else {
        const toast = this.toastCtrl.create({
          message: 'Você não pode se adicionar como amigo, mas valeu a tentativa!',
          duration: 3000
        });
        toast.present();
      }
    }
    // sala.criador = this.usuarioProvider.getEmailUsuarioAtual();
    // this.salasProvider.save(sala);
    // this.viewCtrl.dismiss();
  }

  fecharModal() {
    this.viewCtrl.dismiss();
  }

}
