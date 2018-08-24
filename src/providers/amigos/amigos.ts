import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable()
export class AmigosProvider {

  private PATH = 'amigos/';

  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;

  constructor(private db: AngularFireDatabase) {
    this.itemsRef = this.db.list('amigos');
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  getAll() {
    return this.items;
  }

  get(key: string) {
  }

  save(amigo: any) {
    this.itemsRef.push(amigo);
  }

  remove(key: string) {
    return this.db.list(this.PATH).remove(key);
  }
}
