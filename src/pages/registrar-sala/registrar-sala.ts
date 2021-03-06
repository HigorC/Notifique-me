import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { SalasProvider } from '../../providers/salas/salas';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { Geolocation } from '@ionic-native/geolocation';
import { MapsProvider } from '../../providers/maps/maps';
import { ImagensProvider } from '../../providers/imagens/imagens';

import * as firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
/**
 * Generated class for the RegistrarSalaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registrar-sala',
  templateUrl: 'registrar-sala.html',
})
export class RegistrarSalaPage {

  sala = {
    nome: '',
    privada: false,
    senha: '',
    raio: 100
  };
  imgPath: string;
  positionAux; watchPosition;

  constructor(
    public navCtrl: NavController,
    private geolocation: Geolocation,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private salasProvider: SalasProvider,
    private usuarioProvider: UsuarioProvider,
    private mapasProvider: MapsProvider,
    public loadingCtrl: LoadingController,
    private imagensProvider: ImagensProvider,
    private camera: Camera,
    private toastCtrl: ToastController) {

    this.positionAux = navParams.get('posicao');
    console.log(this.positionAux);


  }

  resetarVariaveis() {
    this.positionAux = {
      coords: {
        accuracy: 9999
      }
    };
  }

  salvarSala(sala) {

    // console.log(sala.raio);

    // sala.raio = parseInt(sala.raio);
    // console.log(sala.raio);
    const that = this;
    // this.resetarVariaveis();

    let loading = this.loadingCtrl.create({
      content: 'Salvando sala...'
    });

    loading.present();


    // this.watchPosition = navigator.geolocation.watchPosition(function (pos) {
    // if (pos.coords.accuracy < that.positionAux.coords.accuracy) {
    //   that.positionAux = pos;
    // } else {
    // navigator.geolocation.clearWatch(that.watchPosition);
    sala.coordenadas = {
      lat: that.positionAux.coords.latitude,
      lng: that.positionAux.coords.longitude
    }


    console.log(sala);
    console.log(that.positionAux.coords.latitude);



    sala.criador = that.usuarioProvider.getEmailUsuarioAtual();
    if (!sala.descricao)
      sala.descricao = 'Entre para conversar!'

    that.salasProvider.save(sala).then(res => {
      console.log(res);
      // UMA VEZ SALVO O BASE64 NA IMAGEM, PODE-SE SALVAR A IMAGEM NO FIREBASE STORAGE
      that.imagensProvider.salvarImagem('/salas/' + res.key + '/', 'fotoSala', that.imgPath);

    });
    loading.dismiss();
    that.viewCtrl.dismiss({ atualizarSalas: true });
    // }
    // }, function (err) {
    //   console.error(err);
    // }, { enableHighAccuracy: true });
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


    } catch (e) {
      console.error(e);
    }
  }

  fecharModal() {
    this.viewCtrl.dismiss();
  }

}
