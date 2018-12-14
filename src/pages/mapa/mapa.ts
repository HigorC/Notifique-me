import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {
  map: GoogleMap;
  watchPosition;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, private geolocation: Geolocation) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapaPage');
    const that = this;
    this.platform.ready().then(() => {
      this.geolocation.getCurrentPosition().then((resp) => {
        console.log(resp);

        that.loadMap(resp.coords.latitude, resp.coords.longitude, this.navParams.get('salas'));
      })
    })

    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(function (position) {
    //     console.log(position);
    //   }, function (err) {
    //     console.error(err);
    //   }, { enableHighAccuracy: true });
    // } else {
    //   console.log('nav n suporta geolo');
    // }


  }

  ionViewDidLeave() {
    console.log('cancelando o watch do mapa');
    navigator.geolocation.clearWatch(this.watchPosition);
  }

  loadMap(lat, lng, salas) {
    let latLngAtual = { lat: lat, lng: lng }

    const corPorTamanho = {
      20: '#b0c0ff',
      40: '#84ffc7',
      60: '#cc92ff',
      80: '#fffb4f',
      100: '#FF0000'
    }

    var map = new google.maps.Map(
      document.getElementById('map'), {
        zoom: 18,
        center: latLngAtual,
        mapTypeControl: false,
        disableDefaultUI: true
      });

    var marker = new google.maps.Marker({
      position: latLngAtual,
      map: map
    });

    // let watch = this.geolocation.watchPosition();
    // watch.subscribe((data) => {
    //   console.log(data);
    //   marker.setPosition({ lat: data.coords.latitude, lng: data.coords.longitude });
    // });


    // setTimeout(function () {
    this.watchPosition = navigator.geolocation.watchPosition(function (position) {
      console.log(position);
      marker.setPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
    }, function (err) {
      console.error(err);
    }, { enableHighAccuracy: true });
    // }, 1000)





    salas.forEach(sala => {
      if (sala.coordenadas) {
        var circuloSalas = new google.maps.Circle({
          strokeColor: corPorTamanho[sala.raio],
          strokeOpacity: 0.5,
          strokeWeight: 2,
          fillColor: corPorTamanho[sala.raio],
          fillOpacity: 0.15,
          label: 'aaaa',
          map: map,
          center: {
            lat: sala.coordenadas.lat,
            lng: sala.coordenadas.lng
          },
          radius: sala.raio ? sala.raio : 10
        });

        var marker = new google.maps.Marker({
          position: {
            lat: sala.coordenadas.lat,
            lng: sala.coordenadas.lng
          },
          map: map
        });

        var contentString = '<div id="content">' +
          '<h1 id="firstHeading" class="firstHeading">' + sala.nome + '</h1>' +
          '</div>';

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });

        marker.addListener('click', function () {
          infowindow.open(map, marker);
        });
      }
    });

  }
}


