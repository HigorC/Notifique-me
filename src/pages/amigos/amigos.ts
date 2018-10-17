import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { AdicionarAmigoModalPage } from '../adicionar-amigo-modal/adicionar-amigo-modal';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { ImagensProvider } from '../../providers/imagens/imagens';

/**
 * Generated class for the AmigosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-amigos',
  templateUrl: 'amigos.html',
})
export class AmigosPage {

  meusConvites;
  meusAmigos;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private usuarioProvider: UsuarioProvider,
    public toastCtrl: ToastController,
    private imagensProvider: ImagensProvider) {

    this.prepararConvites();
    this.prepararAmigos();
  }

  prepararConvites() {
    const that = this;
    this.usuarioProvider.getAllConvites().forEach(function (convites) {
      that.meusConvites = [];
      convites.forEach(function (convite) {
        convite.u.then(function (res) {
          that.imagensProvider.downloadImagem('/usuarios/', convite.uid).then(caminhoImagem => {
            let conviteCerto = {
              key: convite.key,
              nome: res.nome,
              email: res.email,
              urlImagemPerfil: caminhoImagem ? caminhoImagem : 'assets/imgs/friend.png'
            };
  
            that.meusConvites.push(conviteCerto)
          })
        })
      })
    })
  }

  prepararAmigos() {
    const that = this;
    this.usuarioProvider.getAllAmigos().forEach(function (amigos) {
      that.meusAmigos = [];
      amigos.forEach(function (amigo) {
        amigo.u.then(function (res) {
          that.imagensProvider.downloadImagem('/usuarios/', amigo.uid).then(caminhoImagem => {
            let amigoCerto:any = {
              key: amigo.key,
              nome: res.nome,
              email: res.email,
              urlImagemPerfil: caminhoImagem ? caminhoImagem : 'assets/imgs/friend.png'
            };
            that.meusAmigos.push(amigoCerto)
          })
        })
      })
    })
  }

  aceitarConvite(keyConvite) {
    const that = this;
    this.usuarioProvider.aceitarConvite(keyConvite).then(function (res) {
      const toast = that.toastCtrl.create({
        message: 'Amigo adicionado!',
        duration: 3000
      });
      toast.present();
    });

  }

  recusarConvite(keyConvite) {
    const that = this;
    this.usuarioProvider.excluirConvite(keyConvite).then(function (res) {
      const toast = that.toastCtrl.create({
        message: 'Convite excluído com sucesso!',
        duration: 3000
      });
      toast.present();
    }).catch(function (err) {
      console.error(err);
      const toast = that.toastCtrl.create({
        message: 'Algo deu errado...',
        duration: 3000
      });
      toast.present();
    });
  }

  adicionarAmigo() {
    let profileModal = this.modalCtrl.create(AdicionarAmigoModalPage);
    profileModal.present();

    profileModal.onDidDismiss(data => {
      console.log(data);
    });
  }

  excluirAmigo(keyAmigo) {
    this.usuarioProvider.excluirAmigo(keyAmigo);
    console.log(keyAmigo);

  }

}
