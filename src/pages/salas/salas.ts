import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { RegistrarSalaPage } from '../registrar-sala/registrar-sala';
import { SalasProvider } from '../../providers/salas/salas';
import { Observable } from 'rxjs/Observable';
import { ConversaPage } from '../conversa/conversa';
import { Geofence } from '@ionic-native/geofence';

/**
 * Generated class for the SalasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-salas',
    templateUrl: 'salas.html',
})
export class SalasPage {
    // salas: Observable<any>;
    salas;

    msgTeste

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public modalCtrl: ModalController,
        private salasProvider: SalasProvider,
        public alertCtrl: AlertController,
        private geofence: Geofence) {
        // this.salas = this.salasProvider.getAll();
        // this.atualizarSalasDisponiveis();

        geofence.initialize().then(
            // resolved promise does not return a value
            () => this.msgTeste = 'Geofence Plugin Ready',
            (err) => this.msgTeste = err
        )

    }

    ionViewDidEnter() {
        console.log('atualizando paginas');

        this.atualizarSalasDisponiveis();
    }

    atualizarSalasDisponiveis() {
        const that = this;
        this.salasProvider.getAllNaoBloqueadas().then(function (res) {
            that.salas = res;
        });
    }

    novaSala() {
        let profileModal = this.modalCtrl.create(RegistrarSalaPage);
        profileModal.present();

        profileModal.onDidDismiss(data => {
            this.atualizarSalasDisponiveis();
        });
    }

    entrarNaSala(sala) {
        let conversaModal = this.modalCtrl.create(ConversaPage, { salaKey: sala.key });
        conversaModal.present();

        conversaModal.onDidDismiss(data => {
            this.atualizarSalasDisponiveis();
        });
    }

    verificarSenhaSala(sala) {
        const that = this;

        if (sala.privada) {

            this.salasProvider.salaTemUsuario(sala.key).then(function (usuarioEstaNaSala) {

                if (usuarioEstaNaSala) {
                    that.entrarNaSala(sala);
                } else {
                    let alert = that.alertCtrl.create({
                        title: 'Sala privada',
                        message: 'Esta sala é privada, digite a senha para entrar.',
                        inputs: [
                            {
                                name: 'senha',
                                placeholder: 'Senha',
                                type: 'password'
                            }
                        ],
                        buttons: [
                            {
                                text: 'Cancelar',
                                role: 'cancel',
                                handler: data => {
                                    console.log('Cancel clicked');
                                }
                            },
                            {
                                text: 'Entrar',
                                handler: data => {
                                    console.log(data);
                                    if (data.senha === sala.senha) {
                                        that.entrarNaSala(sala);
                                    } else {
                                        that.exibirAlertaInformacao("Erro!", "A senha está incorreta.");
                                    }
                                }
                            }
                        ]
                    });
                    alert.present();
                }
            })
        } else {
            this.entrarNaSala(sala);
        }
    }

    exibirInformacaoAmigo() {
        this.exibirAlertaInformacao("Amigos por perto!", "Você tem um ou mais amigos nesta sala.");
    }

    exibirInformacaoSalaBloqueada() {
        this.exibirAlertaInformacao("Bloqueada", "Para entrar nesta sala você precisa de uma senha.");
    }

    exibirAlertaInformacao(titulo, mensagem) {
        const alert = this.alertCtrl.create({
            title: titulo,
            subTitle: mensagem,
            buttons: ['OK']
        });
        alert.present();
    }

}
