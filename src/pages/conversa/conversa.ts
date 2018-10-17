import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController, ToastController, ModalController, Content } from 'ionic-angular';
import { SalasProvider } from '../../providers/salas/salas';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth'
import { Mensagem } from '../../models/mensagem';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { User } from '../../models/user';
import { ConfigSalaModalPage } from '../config-sala-modal/config-sala-modal';

/**
 * Generated class for the ConversaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
  mensagens: Observable<any>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private salasProvider: SalasProvider,
    private afAuth: AngularFireAuth,
    private usuarioProvider: UsuarioProvider,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController) {

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

    this.mensagens = this.salasProvider.getMensagens(this.salaKey);
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.content.scrollToBottom();
      this.inputMsg.setFocus();
    }, 150);
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

  enviarMensagem(textoMensagem) {
    if (textoMensagem) {

      let dataAtual: Date = new Date();
      let horaAtual = dataAtual.getHours() + ":" + dataAtual.getMinutes();

      console.log(horaAtual);

      let msg = {
        emailAutor: this.meuEmail,
        apelidoAutor: this.usuarioProvider.getDisplayNameUsuarioAtual(),
        mensagem: textoMensagem,
        dataEnvio: horaAtual
      } as Mensagem;

      console.log(msg);

      this.salasProvider.enviarMensagem(this.salaKey, msg);
      this.mensagem = '';
      this.inputMsg.setFocus();
      console.log(this.content.contentHeight);

      this.content.scrollToBottom();
    }
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
