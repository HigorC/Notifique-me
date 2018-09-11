import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable()
export class SalasProvider {

  private PATH = 'salas/';

  salasRef: AngularFireList<any>;
  salas: Observable<any[]>;

  constructor(private db: AngularFireDatabase) {
    this.salasRef = this.db.list('salas');
    // Use snapshotChanges().map() to store the key
    this.salas = this.salasRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }
  getAll() {
    return this.salas;
  }

  get(key: string) {
    return this.db.object('salas/' + key).valueChanges();
  }

  save(sala: any) {
    this.salasRef.push(sala);
  }

  remove(key: string) {
    this.db.object('salas/' + key).update({ excluirSala: true }).then(function () {
      this.db.list(this.PATH).remove(key);
    });

    // return this.db.list(this.PATH).remove(key);
  }

  getMensagens(keySala) {
    return this.db.list('salas/' + keySala + '/mensagens/').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  enviarMensagem(KeySala, mensagem) {
    this.db.list('salas/' + KeySala + '/mensagens/').push(mensagem);
  }

  getUsuariosDeUmaSala(keySala) {
    return this.db.list('salas/' + keySala + '/usuarios').valueChanges();
  }

  removerTodosUsuariosDeUmaSala(keySala){
    
  }

  async cadastrarUsuarioNaSala(keySala, keyUsuario) {
    const that = this;

    this.getUsuariosDeUmaSala(keySala).forEach(function (observable) {
      if (observable.map(function (usuario: any) {
        return usuario.key;
      }).indexOf(keyUsuario) === -1) {
        that.db.list('salas/' + keySala + '/usuarios/').push({ key: keyUsuario });
      } else{
        console.log('usuario ja esta na sala');
      }


    });
  }
}
