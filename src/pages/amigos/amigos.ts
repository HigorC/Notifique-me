import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AmigosProvider } from '../../providers/amigos/amigos';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-amigos',
  templateUrl: 'amigos.html',
})
export class AmigosPage {
  title: string;
  amigo;
  form: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, private provider: AmigosProvider,
    private toast: ToastController) {

    this.amigo = this.navParams.data.amigo || {};
    this.setupPageTitle();
    this.createForm();
  }

  private setupPageTitle() {
    this.title = this.navParams.data.amigo ? 'Alterando amigo' : 'Novo amigo';
  }

  createForm() {
    this.form = this.formBuilder.group({
      key: [this.amigo.key],
      nome: [this.amigo.nome, Validators.required],
      email: [this.amigo.email, Validators.required],
    })
  }

  onSubmit(amigo) {

    this.provider.save(amigo);
    this.toast.create({ message: 'Salvo', duration: 3000 }).present();
    this.navCtrl.pop();

    // if (this.form.valid) {
    //   this.provider.save(this.form.value)
    //     .then(() => {
    //       this.toast.create({ message: 'Salvo', duration: 3000 }).present();
    //       this.navCtrl.pop();
    //     })
    //     .catch((e) => {
    //       this.toast.create({ message: 'erro', duration: 3000 }).present();
    //       console.error(e);

    //     })
    // }
  }

}
