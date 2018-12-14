import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { SalasProvider } from '../../providers/salas/salas';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { ImagensProvider } from '../../providers/imagens/imagens';

import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from 'firebase';

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
  imgPath;
  nomeSala;
  descricaoSala;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private salasProvider: SalasProvider,
    public toastCtrl: ToastController,
    private usuarioProvider: UsuarioProvider,
    public loadingCtrl: LoadingController,
    private camera: Camera,
    private imagensProvider: ImagensProvider,
    public alertCtrl: AlertController) {

    const that = this;

    this.salaKey = navParams.get('keySala');
    this.nomeSala = this.navParams.get('nomeSala');
    this.souOCriador = this.salasProvider.AmITheCreator(this.salaKey).then(function (res) {
      that.souOCriador = res;
    });

    this.salasProvider.getDescricaoSala(this.salaKey).then(descricao => {
      console.log(descricao.val());

      this.descricaoSala = descricao.val();
    })
  }

  ionViewDidLoad() {
    const that = this;
    this.atualizarListaUsuariosABloquear().then(usuarios => {
      that.todosUsuarios = usuarios;
    });

    that.imagensProvider.downloadImagem('/salas/' + this.salaKey + '/', 'fotoSala').then(res => {
      this.imgPath = res ? res : 'assets/imgs/group.png';
    });
  }

  exibirToast(mensagem, tempo?) {
    const toast = this.toastCtrl.create({
      message: mensagem,
      duration: tempo ? tempo : 4000,
      position: 'top'
    });
    toast.present();
  }

  enviarConvite(usuario) {

    const that = this;

    this.usuarioProvider.isMeuAmigo(usuario.key).then(jaEAmigo => {
      if (jaEAmigo) {
        that.exibirToast('Vocês já são amigos!');
      } else {
        that.usuarioProvider.enviarConviteAmizade(usuario.email).then(res => {
          that.exibirToast('Convite enviado!');
          console.log(res);
        }).catch(err => {
          console.log(err);
          that.exibirToast(err);
        })
      }
    })
  }

  atualizarListaUsuariosABloquear() {
    const that = this;

    return this.salasProvider.getArrayAllUsuariosDeUmaSalaSemListener(this.salaKey).then(function (usuarios) {
      // that.todosUsuarios = usuarios;
      return usuarios;
    });
  }

  bloquearUsuarios(usuariosABloquear: any) {
    const that = this;
    usuariosABloquear.forEach(function (usuario) {
      that.salasProvider.alterarBloqueioDeUmUsuarioDeUmaSala(usuario.key, that.salaKey, true);
    });
    this.atualizarListaUsuariosABloquear().then(usuarios => {
      that.todosUsuarios = usuarios;
    });
  }

  desbloquearUsuarios(usuariosADesbloquear: any) {
    const that = this;
    usuariosADesbloquear.forEach(function (usuario) {
      that.salasProvider.alterarBloqueioDeUmUsuarioDeUmaSala(usuario.key, that.salaKey, false);
    });
    this.atualizarListaUsuariosABloquear().then(usuarios => {
      that.todosUsuarios = usuarios;
    });
  }

  excluirSala() {
    //Remove a sala do DB
    this.salasProvider.remove(this.salaKey);
    this.navCtrl.popToRoot();
  }

  sairDaSala() {
    this.salasProvider.removerUsuarioDaSala(this.salaKey);
    this.viewCtrl.dismiss({ usuarioSaiuDaSala: true });
    // this.navCtrl.popToRoot();
  }

  fecharModal() {
    this.viewCtrl.dismiss();
  }

  alterarNomeSala() {
    const prompt = this.alertCtrl.create({
      title: 'Alterar nome da sala',
      message: "Digite o novo nome da sala",
      inputs: [
        {
          name: 'nome',
          value: this.nomeSala
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Salvar',
          handler: data => {
            if (!data.nome) {
              this.exibirToast('O nome da sala não pode ser vazio!', 2000);
            } else {
              this.salasProvider.updateNomeSala(this.salaKey, data.nome).then(res => {
                this.nomeSala = data.nome;
                this.exibirToast('Nome alterado!', 2000);
              });
            }
          }
        }
      ]
    });
    prompt.present();
  }

  alterarDescricaoSala() {
    const prompt = this.alertCtrl.create({
      title: 'Alterar a descrição da sala',
      message: "Digite a nova descrição da sala",
      inputs: [
        {
          name: 'descricao',
          value: this.descricaoSala
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Salvar',
          handler: data => {
            this.salasProvider.updateDescricaoSala(this.salaKey, data.descricao).then(res => {
              this.descricaoSala = data.descricao;
              this.exibirToast('Descrição alterada!', 2000);
            });
          }
        }
      ]
    });
    prompt.present();
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
        content: 'Salvando imagem da sala...'
      });

      loading.present();

      // UMA VEZ SALVO O BASE64 NA IMAGEM, PODE-SE SALVAR A IMAGEM NO FIREBASE STORAGE
      this.imagensProvider.salvarImagem('/salas/' + this.salaKey + '/', 'fotoSala', this.imgPath).then(res => {
        loading.dismiss();
        if (res.state === 'success') {
          console.log('res.state é succes');
          const toast = that.toastCtrl.create({
            message: 'Imagem da sala alterada!',
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
}
