import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController, ToastController } from 'ionic-angular';
import { User } from '../../models/user';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';
import { ImagensProvider } from '../../providers/imagens/imagens';

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
  imgPath: string;
  fileToUpload: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private usuarioProvider: UsuarioProvider,
    private afAuth: AngularFireAuth,
    public appCtrl: App,
    public loadingCtrl: LoadingController,
    private fb: FirebaseApp,
    private camera: Camera,
    private imagensProvider: ImagensProvider,
    private toastCtrl: ToastController
  ) {
    this.usuario = usuarioProvider.getUsuarioAtualSimplificado();
  }

  ionViewDidLoad() {
    // Seta a imagem de perfil
    this.imagensProvider.downloadImagem('/usuarios/', this.usuarioProvider.getIdUsuarioAtual()).then(res => {
      this.imgPath = res ? res : 'assets/imgs/friend.png';
    });
  }

  deslogar() {
    localStorage.removeItem('email');
    localStorage.removeItem('senha');

    let loading = this.loadingCtrl.create({
      content: 'Deslogando...'
    });

    loading.present();

    this.afAuth.auth.signOut().then(res => {
      loading.dismiss();
    });
    this.appCtrl.getRootNav().setRoot(LoginPage);
  }

  salvar() {
    let loading = this.loadingCtrl.create({
      content: 'Salvando...'
    });

    loading.present();

    // this.imagensProvider.salvarImagem('/usuarios/', this.usuarioProvider.getIdUsuarioAtual(), this.imgPath).then(res => {
    //   if (res.state === "success") {

    //   }
    //   console.log(res);
    // })

    this.usuarioProvider.atualizarUsuario(this.usuario).then(res => {
      console.log(res);
      loading.dismiss();

      const toast = this.toastCtrl.create({
        message: 'Alterações salvas!',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

  async tirarFoto() {
    const that = this;
    try {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 700,
        targetHeight: 700
      }

      const result = await this.camera.getPicture(options);

      // const image = `data:image/jpeg;base64,${result}`;
      this.imgPath = `data:image/jpeg;base64,${result}`;

      let loading = this.loadingCtrl.create({
        content: 'Salvando imagem de perfil...'
      });
  
      loading.present();

      // UMA VEZ SALVO O BASE64 NA IMAGEM, PODE-SE SALVAR A IMAGEM NO FIREBASE STORAGE
      this.imagensProvider.salvarImagem('/usuarios/', this.usuarioProvider.getIdUsuarioAtual(), this.imgPath).then(res => {
        loading.dismiss();
        if (res.state === 'success') {
          console.log('res.state é succes');
          const toast = that.toastCtrl.create({
            message: 'Imagem de perfil alterada!',
            duration: 3000,
            position: 'top'
          });
          toast.present();
        } else {
          console.log('res.state nao é succes');
          console.log(res);
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  salvarImagem(imagem) {
    console.log('imagem = ', imagem);

    console.log('usuarios/' + this.usuarioProvider.getIdUsuarioAtual());

    const pictures = firebase.storage().ref('/usuarios/' + this.usuarioProvider.getIdUsuarioAtual());
    return pictures.putString(imagem, 'data_url');
  }

}
