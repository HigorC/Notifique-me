import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController, ToastController, ModalController, LoadingController, Content } from 'ionic-angular';
import { SalasProvider } from '../../providers/salas/salas';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth'
import { Mensagem } from '../../models/mensagem';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { User } from '../../models/user';
import { ConfigSalaModalPage } from '../config-sala-modal/config-sala-modal';

import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from 'firebase';
import { ImagensProvider } from '../../providers/imagens/imagens';

import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { ArquivosProvider } from '../../providers/arquivos/arquivos';

@IonicPage()
@Component({
  selector: 'page-conversa',
  templateUrl: 'conversa.html',
})
export class ConversaPage {


  @ViewChild('inputMsg') inputMsg;
  @ViewChild(Content) content: Content;

  salaKey: any;
  sala: any;
  meuEmail;
  mensagem;
  mensagens: any[];

  msgsSemImagem: any = new Map();

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private salasProvider: SalasProvider,
    private afAuth: AngularFireAuth,
    private usuarioProvider: UsuarioProvider,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    private camera: Camera,
    public modalCtrl: ModalController,
    private imagensProvider: ImagensProvider,
    private fileChooser: FileChooser,
    private file: File,
    private arquivosProvider: ArquivosProvider,
    public loadingCtrl: LoadingController) {





    this.meuEmail = this.usuarioProvider.getEmailUsuarioAtual();
    this.salaKey = navParams.get('salaKey');
    this.salasProvider.get(this.salaKey).subscribe(
      data => {
        this.sala = data;
      }
    );

    const that = this;
    this.salasProvider.cadastrarUsuarioNaSala(this.salaKey, this.usuarioProvider.getIdUsuarioAtual()).then(function () {
      that.salasProvider.getUsuario(that.usuarioProvider.getIdUsuarioAtual(), that.salaKey).subscribe(function (usuario: any) {
        // Verifica se o usuário atual está bloqueado, se estiver manda-o para a lista de salas
        console.log('----');

        console.log(usuario.payload.val());

        if (usuario.payload.val() && usuario.payload.val().bloqueado) {
          that.salaExcluida();
        }

      });
    });
    // this.mensagens = 
    this.salasProvider.getMensagens(this.salaKey).subscribe(mensagensListener => {



      // if (this.msgsSemImagem.size > 0) {
      //   this.verificarSeChegouImagem();
      // }

      console.log('-------------------------------------');
      console.log(mensagensListener);
     

      let ultimaMsg = mensagensListener[mensagensListener.length - 1];

      if (!this.mensagens) {
        this.mensagens = mensagensListener;
      } else {
        // if (ultimaMsg)
        //   this.mensagens.push(ultimaMsg);

        if (ultimaMsg) {
          if (!ultimaMsg.imagem || (ultimaMsg.imagem && ultimaMsg.urlFoto))
            this.mensagens.push(ultimaMsg);
        }
      }
      console.log('-------------------------------------');
      console.log(this.mensagens);
      for (let i = 0; i < this.mensagens.length; i++) {
        if (this.mensagens[i].key !== mensagensListener[i].key) {
          this.mensagens[i] = mensagensListener[i];
        }
      }

      this.content.scrollTo(100, 99999);

      // if (ultimaMsg && ultimaMsg.imagem && !ultimaMsg.urlFoto) {

      //   this.msgsSemImagem.set(this.mensagens.length - 1, ultimaMsg);
      //   console.log(this.msgsSemImagem);

      // }
    });
  }

  // verificarSeChegouImagem() {
  //   console.log('ENTROU NA VERIFICAÇÃO');

  //   const that = this;

  //   console.log(this.msgsSemImagem);



  //   this.msgsSemImagem.forEach(function (value, key) {
  //     if (!that.mensagens[key].urlFoto)
  //       that.imagensProvider.downloadImagem('/salas/' + that.salaKey + '/mensagens/', value.key).then(res => {
  //         console.log(res);
  //         that.mensagens[key].urlFoto = res;
  //       })
  //   }, this.msgsSemImagem)
  // }


  ionViewDidEnter() {


    setTimeout(() => {
      this.content.scrollToBottom();
      // this.inputMsg.setFocus();
    }, 50);
  }

  salaExcluida() {
    const toast = this.toastCtrl.create({
      message: 'Esta sala foi deletada, você será redirecionado para a lista de salas.',
      duration: 3000
    });
    toast.present();
    // Retorna para a tela anterior
    this.voltarParaSalas();
  }

  enviarMensagem(textoMensagem?) {

    let dataAtual: Date = new Date();
    let horaAtual = dataAtual.getHours() + ":" + dataAtual.getMinutes();
    let msg = {};

    if (textoMensagem) {
      msg = {
        emailAutor: this.meuEmail,
        apelidoAutor: this.usuarioProvider.getDisplayNameUsuarioAtual(),
        mensagem: textoMensagem,
        dataEnvio: horaAtual
      };

      console.log(msg);
      this.salasProvider.enviarMensagem(this.salaKey, msg);
      this.mensagem = '';
      this.inputMsg.setFocus();

      this.content.scrollTo(100, 99999);
    }
  }

  enviarFoto(base64) {
    let dataAtual: Date = new Date();
    let horaAtual = dataAtual.getHours() + ":" + dataAtual.getMinutes();
    let msg = {
      emailAutor: this.meuEmail,
      apelidoAutor: this.usuarioProvider.getDisplayNameUsuarioAtual(),
      imagem: true,
      dataEnvio: horaAtual
    };

    const keyPraSalvar = this.salasProvider.getKeyMensagem(this.salaKey);

    this.salvarImagemNoStorage(keyPraSalvar, base64).then(res => {
      console.log(res);

      this.salasProvider.enviarMensagem(this.salaKey, msg, keyPraSalvar);
    });

    this.mensagem = '';
    this.inputMsg.setFocus();
    console.log(this.content.contentHeight);

    this.content.scrollToBottom();

    // this.salasProvider.enviarMensagem(this.salaKey, msg).then(res => {
    //   this.salvarImagemNoStorage(res.key, base64);
    //   this.mensagem = '';
    //   this.inputMsg.setFocus();
    //   console.log(this.content.contentHeight);

    //   this.content.scrollToBottom();
    // });
  }

  async tirarFoto() {
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
      let base64 = `data:image/jpeg;base64,${result}`;

      this.enviarFoto(base64);
    } catch (e) {
      console.error(e);
    }
  }

  async salvarImagemNoStorage(nomeImagem, base64) {
    // UMA VEZ SALVO O BASE64 NA IMAGEM, PODE-SE SALVAR A IMAGEM NO FIREBASE STORAGE
    console.log('/salas/' + this.salaKey + '/mensagens/');

    return this.imagensProvider.salvarImagem('/salas/' + this.salaKey + '/mensagens/', nomeImagem, base64).then(res => {
      // this.salasProvider.adicionarUrlFotoAMensagem(this.salaKey, nomeImagem);
      console.log(res);
    }).catch(err => {
      console.error(err);
    });
  }

  mostrarOpcoesDaSala() {
    const modal = this.modalCtrl.create(ConfigSalaModalPage, { 'keySala': this.salaKey, 'nomeSala': this.sala.nome });
    modal.onDidDismiss(data => {
      if (data && data.usuarioSaiuDaSala)
        this.voltarParaSalas();
    });
    modal.present();
  }

  voltarParaSalas() {
    this.viewCtrl.dismiss();
  }

}
