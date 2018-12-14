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
import { ImagensProvider } from '../../providers/imagens/imagens';
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

    salasProximas = [];
    salasDistantes = [];

    watchPosition;
    positionAux;

    tentativasAtualizar;

    flagTestandoNoPc = false;

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
        public toastCtrl: ToastController,
        private imagensProvider: ImagensProvider
    ) {

        this.platform.ready().then(() => {
            if (this.flagTestandoNoPc) {
                console.log('Geofence Plugin Ready')

                // this.entrarNaSala({salaKey:'-LNgJIw9rR5neKQWhzp-'});
                // this.atualizarSalasDisponiveis();
            } else {
                this.geofence.initialize().then(
                    () => {
                        console.log('Geofence Plugin Ready')
                        this.atualizarSalasDisponiveis();

                    },
                    (err) => console.log(err)
                );

                // this.geofence.onTransitionReceived().subscribe(fences => {
                //     console.log('atualizou pelo listener');
                //     this.atualizarSalasDisponiveis();
                // })
            }
        });

    }

    inicializarVariaveis() {
        this.tentativasAtualizar = 0;
        this.salasProximas = [];
        this.salasDistantes = [];
        this.positionAux = {
            coords: {
                accuracy: 9999
            }
        };
    }

    ionViewDidEnter() {
        // this.inicializarVariaveis();
        // console.log('atualizando paginas');
        const that = this;

        // console.log('aux');
        // console.log(that.positionAux);

        if (!this.usuarioProvider.getDisplayNameUsuarioAtual()) {
            const prompt = this.alertCtrl.create({
                title: 'Apelido',
                message: "Você precisa de um apelido para entrar em uma sala!",
                enableBackdropDismiss: false,
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

        // TIREI DAQUI
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
            if (that.flagTestandoNoPc) {
                that.positionAux.coords.accuracy = 2;
            }
            // that.tentativasAtualizar < 6 && 
            loading.setContent(`Tentando melhorar a precisão... a acurácia atual é de ${position.coords.accuracy.toString()}`);
            if (position.coords.accuracy < that.positionAux.coords.accuracy) {
                if (position.coords.accuracy < 10) {
                    that.positionAux = position;
                } else {
                    that.tentativasAtualizar++;
                }
                console.log(that.tentativasAtualizar);
            } else {
                that.tentativasAtualizar = 0;
                // CANELO O WATCH PARA NÃO MONITORAR MAIS A LOCALIZAÇÃO
                navigator.geolocation.clearWatch(that.watchPosition);

                loading.setContent(`Carregando salas...`);
                that.salasProvider.getAllSL().then(function (res: any) {

                    // console.log(res.val());

                    const qtd_salas = Object.keys(res.val()).length
                    let contador_salas = 0;



                    // loading.dismiss();
                    // that.exibirToast('Salas carregadas!');
                    let idFenceNotification = 0;
                    that.geofence.removeAll().then(resFence => {
                        console.log(res);

                        res.forEach(sala => {
                            contador_salas++;
                            if (!sala.val().usuarios || !sala.val().usuarios[that.usuarioProvider.getIdUsuarioAtual()] || sala.val().usuarios[that.usuarioProvider.getIdUsuarioAtual()].bloqueado === false) {
                                // console.log(sala);

                                let s = sala.val();
                                s.key = sala.key;
                                if (s.coordenadas) {

                                    that.imagensProvider.downloadImagem('/salas/' + sala.key + '/', 'fotoSala').then(res => {
                                        s.urlImgSala = res ? res : 'assets/imgs/group.png';
                                    });
                                    that.mapsProvider.calcularDistanciaFormula(s.coordenadas).then(function (distancia: any) {
                                        // DISTANCIA DA SALA
                                        s.distancia = distancia;
                                        // VERIFICA SE TEM AMIGO NA SALA
                                        that.salasProvider.salaTemAlgumAmigo(sala.key).then(function (res) {
                                            s.temAmigo = res;
                                        });

                                        //  ADICIONA A SALA NO VETOR DAS PROXIMAS
                                        if (distancia <= s.raio) {
                                            that.salasProximas.push(s);

                                            let fence = {
                                                id: s.key,
                                                latitude: s.coordenadas.lat, //center of geofence radius
                                                longitude: s.coordenadas.lng,
                                                radius: s.raio, //radius to edge of geofence in meters
                                                transitionType: 2, //see 'Transition Types' below
                                                notification: { //notification settings
                                                    id: idFenceNotification++, //any unique ID
                                                    title: s.nome, //notification title
                                                    text: 'Você acaba de sair dos limites desta sala ', //notification body
                                                    openAppOnClick: true, //open app when notification is tapped
                                                    notification: {
                                                        vibrate: [0]
                                                    }
                                                }
                                            }

                                            that.geofence.addOrUpdate(fence).then(
                                                () => console.log('Geofence added'),
                                                (err) => console.log('Geofence failed to add')
                                            );

                                        } else {
                                            that.salasDistantes.push(s);

                                            let fence = {
                                                id: s.key,
                                                latitude: s.coordenadas.lat, //center of geofence radius
                                                longitude: s.coordenadas.lng,
                                                radius: s.raio, //radius to edge of geofence in meters
                                                transitionType: 1, //see 'Transition Types' below
                                                notification: { //notification settings
                                                    id: idFenceNotification++, //any unique ID
                                                    title: s.nome, //notification title
                                                    text: s.descricao, //notification body
                                                    openAppOnClick: true, //open app when notification is tapped
                                                    notification: {
                                                        vibrate: [0]
                                                    }
                                                }
                                            }

                                            that.geofence.addOrUpdate(fence).then(
                                                () => console.log('Geofence added'),
                                                (err) => console.log('Geofence failed to add')
                                            );
                                        }
                                    })
                                }
                            }


                            if (contador_salas === qtd_salas) {
                                setTimeout(function () {
                                    loading.dismiss();
                                    that.exibirToast('Salas carregadas!');
                                }, 500);
                            }
                        })

                    }).catch(err => {
                        console.error(err);
                    })


                    if (refresher) {
                        refresher.complete();
                    }
                    return res;
                }).then(function () {

                });


            }
        }, function (err) {
            console.error(err);
            loading.dismiss();
        }, { enableHighAccuracy: true, timeout: 3000 });
    }

    novaSala() {
        let profileModal = this.modalCtrl.create(RegistrarSalaPage, { posicao: this.positionAux });
        profileModal.present();

        profileModal.onDidDismiss(data => {
            if (data && data.atualizarSalas) {
                this.atualizarSalasDisponiveis();
            }
        });
    }

    entrarNaSala(sala) {
        navigator.geolocation.clearWatch(this.watchPosition);

        let conversaModal = this.modalCtrl.create(ConversaPage, { salaKey: sala.key });
        conversaModal.present();

        conversaModal.onDidDismiss(data => {
            if (data && data.atualizarSalas) {
                this.atualizarSalasDisponiveis();
            }
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
        this.exibirToast("Você está muito distante desta sala!");
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
