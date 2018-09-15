import { Component } from '@angular/core';
import { IonicPage, ToastController, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth'
import { AmigosProvider } from '../../providers/amigos/amigos';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  subUsuario;
  amigos: Observable<any>;



  constructor(private afAuth: AngularFireAuth,
    private toast: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private provider: AmigosProvider) {
    // console.log(this.provider.getAll());
    this.amigos = this.provider.getAll();

    // this.provider.getAll()
   

  }

  ionViewDidLoad() {
    // this.subUsuario = this.afAuth.authState.subscribe(data => {
    //   if (data && data.email && data.uid) {
    //     this.toast.create({
    //       message: `Bem vindo ${data.email}`,
    //       duration: 3000
    //     }).present();
    //   } else {
    //     this.toast.create({
    //       message: `Falhou`,
    //       duration: 3000
    //     }).present();
    //   }
    // });
  }

  deslogar() {
    this.afAuth.auth.signOut();
  }

  atual() {
    console.log(this.afAuth.auth.currentUser);
    console.log(this.afAuth.auth.currentUser.getIdToken());
    
  }

  adicionarAmigo() {
    this.navCtrl.push('AmigosPage');
  }

  editarAmigo(amigo) {
    this.navCtrl.push('AmigosPage', { amigo: amigo });
  }

  removerAmigo(key: string) {
    this.provider.remove(key)
      .then(() => {
        this.toast.create({ message: 'Removido', duration: 3000 }).present();
      })
      .catch((e) => {
        this.toast.create({ message: 'Erro', duration: 3000 }).present();
        console.error(e);
      })
  }

}
