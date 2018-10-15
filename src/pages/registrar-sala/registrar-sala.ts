import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { SalasProvider } from '../../providers/salas/salas';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { Geolocation } from '@ionic-native/geolocation';
import { MapsProvider } from '../../providers/maps/maps';
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
    raio: 60
  };

  positionAux; watchPosition;

  constructor(
    public navCtrl: NavController,
    private geolocation: Geolocation,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private salasProvider: SalasProvider,
    private usuarioProvider: UsuarioProvider,
    private mapasProvider: MapsProvider,
    public loadingCtrl: LoadingController) {
  }

  resetarVariaveis() {
    this.positionAux = {
      coords: {
        accuracy: 9999
      }
    };
  }

  salvarSala(sala) {

    const that = this;
    this.resetarVariaveis();

    let loading = this.loadingCtrl.create({
      content: 'Salvando sala...'
    });

    loading.present();


    this.watchPosition = navigator.geolocation.watchPosition(function (pos) {
      if (pos.coords.accuracy < that.positionAux.coords.accuracy) {
        that.positionAux = pos;
      } else {
        navigator.geolocation.clearWatch(that.watchPosition);
        sala.coordenadas = {
          lat: that.positionAux.coords.latitude,
          lng: that.positionAux.coords.longitude
        }
        sala.criador = that.usuarioProvider.getEmailUsuarioAtual();
        that.salasProvider.save(sala);
        loading.dismiss();
        that.viewCtrl.dismiss();
      }
    }, function (err) {
      console.error(err);
    }, { enableHighAccuracy: true });

    // this.geolocation.getCurrentPosition().then((resp) => {
    //   sala.coordenadas = {
    //     lat: resp.coords.latitude,
    //     lng: resp.coords.longitude
    //   }
    //   sala.criador = this.usuarioProvider.getEmailUsuarioAtual();
    //   this.salasProvider.save(sala);
    //   this.viewCtrl.dismiss();
    // })
  }

  fecharModal() {
    this.viewCtrl.dismiss();
  }

}
