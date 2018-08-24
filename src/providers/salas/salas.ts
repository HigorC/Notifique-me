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
  }

  save(sala: any) {
    this.salasRef.push(sala);
  }

  remove(key: string) {
    return this.db.list(this.PATH).remove(key);
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
}
