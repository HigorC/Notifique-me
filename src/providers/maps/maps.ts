import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestOptions, RequestMethod, Headers } from '@angular/http'
import { Geolocation } from '@ionic-native/geolocation';
/*
  Generated class for the MapsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapsProvider {

  constructor(public http: HttpClient, private geolocation: Geolocation) {
    console.log('Hello MapsProvider Provider');
  }

  getLocalAtual() {
    return this.geolocation.getCurrentPosition().then((resp) => {
      return resp
    });
  }

  getAPIKey() {
    return "AIzaSyAMKJHAz3PIgpT8L4IUU-l3g-6kaX3GI-I";
  }

  calcCrow(lat1, lon1, lat2, lon2) {
    let R = 6371; // km
    let dLat = this.toRad(lat2 - lat1);
    let dLon = this.toRad(lon2 - lon1);
    lat1 = this.toRad(lat1);
    lat2 = this.toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    // Conversão para metros e uma casa pós virgula
    return (d * 1000).toFixed(1);
  }

  // Converts numeric degrees to radians
  toRad(Value) {
    return Value * Math.PI / 180;
  }

  async calcularDistanciaFormula(pontoB) {
    let pontoA = await this.getLocalAtual().then(res => {
      return res;
    });

    return this.calcCrow(pontoA.coords.latitude, pontoA.coords.longitude, pontoB.lat, pontoB.lng);
  }


  calcularDistancia(pontoB) {
    return this.calcularDistanciaRequisicao(pontoB).then(function (data) {
      return data;
    })
  }

  async calcularDistanciaRequisicao(pontoB) {
    let pontoA = await this.getLocalAtual().then(res => {
      return res;
    })

    console.log('ponto a = ' + pontoA);

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${pontoA.coords.latitude},${pontoA.coords.longitude}&destinations=${pontoB.lat},${pontoB.lng}&key=${this.getAPIKey()}`;

    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
    });

    return new Promise(resolve => {

      this.http.get(url, { headers: headers }).subscribe(function (data: any) {
        resolve(data.rows[0].elements[0].distance.value)
      }, err => {
        console.log(err);
      });
    })
  }

}
