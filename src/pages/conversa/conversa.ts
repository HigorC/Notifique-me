import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SalasProvider } from '../../providers/salas/salas';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth'
import { Mensagem } from '../../models/mensagem';

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

  sala: any;
  meuEmail;
  mensagem;
  mensagens: Observable<any>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private salasProvider: SalasProvider,
    private afAuth: AngularFireAuth) {

    this.meuEmail = this.afAuth.auth.currentUser.email;

    this.sala = navParams.get('sala');
    this.mensagens = this.salasProvider.getMensagens(this.sala.key);
  }

  enviarMensagem(textoMensagem) {
    let msg = { autor: this.meuEmail, texto: textoMensagem } as Mensagem;
    this.salasProvider.enviarMensagem(this.sala.key, msg);
    this.mensagem = '';
  }

  voltarParaSalas() {
    this.viewCtrl.dismiss();
  }

}
