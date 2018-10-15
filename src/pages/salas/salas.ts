import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, Platform, ToastController, LoadingController } from 'ionic-angular';
import { RegistrarSalaPage } from '../registrar-sala/registrar-sala';
import { SalasProvider } from '../../providers/salas/salas';
import { ConversaPage } from '../conversa/conversa';
import { Geofence } from '@ionic-native/geofence';
import { Geolocation } from '@ionic-native/geolocation';
import { MapaPage } from '../mapa/mapa';
import { MapsProvider } from '../../providers/maps/maps';
import { UsuarioProvider } from '../../providers/usuario/usuario';
// import { MapsProvider } from '../../providers/maps/maps';

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

    salasProximas; salasDistantes;

    watchPosition;
    positionAux;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public modalCtrl: ModalController,
        private salasProvider: SalasProvider,
        public alertCtrl: AlertController,
        private geofence: Geofence,
        private geol: Geolocation,
        public platform: Platform,
        private mapsProvider: MapsProvider,
        public loadingCtrl: LoadingController,
        private usuarioProvider: UsuarioProvider,
        public toastCtrl: ToastController
    ) {
    }

    inicializarVariaveis() {
        this.positionAux = {
            coords: {
                accuracy: 9999
            }
        };
    }

    ionViewDidEnter() {
        // this.inicializarVariaveis();
        console.log('atualizando paginas');
        const that = this;
        console.log('aux');
        console.log(that.positionAux);

        if (!this.usuarioProvider.getDisplayNameUsuarioAtual()) {
            const prompt = this.alertCtrl.create({
                title: 'Apelido',
                message: "Você precisa de um apelido para entrar em uma sala!",
                inputs: [
                    {
                        name: 'apelido',
                        placeholder: 'Apelido'
                    },
                ],
                buttons: [
                    {
                        text: 'Salvar',
                        handler: data => {
                            console.log('Saved clicked');
                            console.log(data);
                            if (data.apelido) {
                                that.usuarioProvider.salvarDisplayName(data.apelido).then(res => {
                                    that.exibirToast("Salvo com sucesso!");
                                    return true;
                                });
                            } else {
                                that.exibirToast("Digite seu apelido!");
                                return false;
                            }
                        }
                    }
                ]
            });
            prompt.present();
        }

        this.platform.ready().then(() => {
            that.atualizarSalasDisponiveis();
        });
    };

    ionViewDidLeave() {
        console.log('saiu');
        navigator.geolocation.clearWatch(this.watchPosition);
    }

    atualizarSalasDisponiveis(refresher?) {
        const that = this;

        let loading = this.loadingCtrl.create({
            content: 'Procurando salas próximas a você...'
        });

        loading.present();

        this.inicializarVariaveis();

        this.watchPosition = navigator.geolocation.watchPosition(function (position) {
            console.log(position);

            // FALSE APENAS PARA TESTES

            let flag = false;

            if (flag && position.coords.accuracy < that.positionAux.coords.accuracy) {
                loading.setContent(`Tentando melhorar a precisão... a acurácia atual é de ${position.coords.accuracy.toString()}`);
                if (position.coords.accuracy < 200) {
                    that.positionAux = position;
                }

            } else {
                loading.setContent(`Carregando salas...`);
                that.salasProvider.getAllNaoBloqueadas().then(function (res) {
                    that.salasProximas = res.proximas;
                    that.salasDistantes = res.distantes;
                    if (refresher) {
                        refresher.complete();
                    }
                    return res;
                });
                loading.dismiss();
                navigator.geolocation.clearWatch(that.watchPosition);
            }
        }, function (err) {
            console.error(err);
            loading.dismiss();
        }, { enableHighAccuracy: true, timeout: 3000 });
    }

    novaSala() {
        let profileModal = this.modalCtrl.create(RegistrarSalaPage);
        profileModal.present();

        profileModal.onDidDismiss(data => {
            this.atualizarSalasDisponiveis();
        });
    }

    entrarNaSala(sala) {
        navigator.geolocation.clearWatch(this.watchPosition);

        let conversaModal = this.modalCtrl.create(ConversaPage, { salaKey: sala.key });
        conversaModal.present();

        conversaModal.onDidDismiss(data => {
            this.atualizarSalasDisponiveis();
        });
    }

    goToMap() {
        this.navCtrl.push(MapaPage, { salas: this.salasProximas.concat(this.salasDistantes) });
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

    exibirToast(mensagem) {
        const toast = this.toastCtrl.create({
            message: mensagem,
            duration: 4000,
            position: 'top'
        });
        toast.present();
    }

    exibirInformacaoAmigo() {
        // this.exibirAlertaInformacao("Amigos por perto!", "Você tem um ou mais amigos nesta sala.");
        this.exibirToast('Você tem um ou mais amigos nesta sala!')
    }

    exibirInformacaoSalaBloqueada() {
        // this.exibirAlertaInformacao("Bloqueada", "Para entrar nesta sala você precisa de uma senha.");
        this.exibirToast('Para entrar nesta sala você precisa de uma senha!')
    }

    exibirInformacaoDistancia(distancia) {
        // this.exibirAlertaInformacao("Distância", "Você está a " + distancia + " metros desta sala.");
        this.exibirToast("Você está a " + distancia + " metros desta sala!");
    }

    exibirInformacaoSalaMuitoLonge(distancia) {
        // this.exibirAlertaInformacao("Longe demais!", "Você está muito distânte desta sala.");
        this.exibirToast("Você está muito distânte desta sala.!");
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
