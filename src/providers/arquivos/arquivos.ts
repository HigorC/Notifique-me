import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
/*
  Generated class for the ArquivosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ArquivosProvider {

  async salvarImagemBlob(buffer, path, nomeArquivo) {
    let blob = new Blob([buffer], { type: "image/jpeg" });

    let storage = firebase.storage();
    // 'arquivos/' + nomeArquivo
    storage.ref(path + nomeArquivo).put(blob).then((d) => {
      alert("done");
    }).catch((err) => {
      console.log('err');
      
      alert(JSON.stringify(err));
    })
  }

  salvarImagem(path, nomeImagem, data_url) {
    const pictures = firebase.storage().ref(path + nomeImagem);
    return pictures.putString(data_url, 'data_url');
  }

  downloadImagem(path, nomeImagem) {
    var storage = firebase.storage();

    return storage.ref().child(path + nomeImagem).getDownloadURL().then(function (url) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function (event) {
        var blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();

      return url;
    }).catch(function (error) {
      console.error(error);
    });

  }

}
