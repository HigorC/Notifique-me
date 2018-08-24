import { Component } from '@angular/core';
import { IonicPage, NavController, UrlSerializer } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { convertUrlToSegments } from 'ionic-angular/umd/navigation/url-serializer';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  user = { email: 'novo@novo.com', senha: '123456' } as User;



  constructor(private afAuth: AngularFireAuth,
    public navCtrl: NavController) {

  }

  async login(user: User) {
    try {
      const result = this.afAuth.auth.signInWithEmailAndPassword(user.email, user.senha);

      if (result) {
        this.navCtrl.setRoot(TabsPage);
        console.log(result);
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  register() {
    this.navCtrl.push('RegistroPage');
  }

}
