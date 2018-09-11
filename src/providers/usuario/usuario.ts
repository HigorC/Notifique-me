import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
/*
  Generated class for the UsuarioProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UsuarioProvider {

  private PATH = 'usuarios/';

  usuariosRef: AngularFireList<any>;
  usuarios: Observable<any[]>;

  constructor(private aFauth: AngularFireAuth,
    private db: AngularFireDatabase) {
    this.usuariosRef = this.db.list('usuarios');
    // Use snapshotChanges().map() to store the key
    this.usuarios = this.usuariosRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  getUsuarioAtual() {
    return this.aFauth.auth.currentUser;
  }

  getUsuarioAtualSimplificado() {
    let usuarioSimplificado = {} as User;
    const usuarioCompleto = this.getUsuarioAtual();

    usuarioSimplificado.email = usuarioCompleto.email;
    usuarioSimplificado.displayName = usuarioCompleto.displayName;
    usuarioSimplificado.photoURL = usuarioCompleto.photoURL;

    return usuarioSimplificado;
  }

  getEmailUsuarioAtual(): string {
    return this.getUsuarioAtual().email;
  }

  getDisplayNameUsuarioAtual(): string {
    return this.getUsuarioAtual().displayName;
  }

  getIdUsuarioAtual(): string {
    // let result = await this.aFauth.auth.currentUser.getIdToken().then(function (data) {
    //   // console.log(data);

    //   return data;
    // })

    // return result;
    return this.getUsuarioAtual().uid;
  }

  async registrarNovoUsuario(usuario: User) {
    try {
      let result = await this.aFauth.auth.createUserWithEmailAndPassword(usuario.email, usuario.senha).then(function (data) {
        return data;
      });

      console.log(result);

      this.db.list('usuarios/').push(result.user.uid);

    } catch (e) {
      console.error(e);
    }
  }

  async atualizarUsuario(usuario) {

    console.log(usuario.displayName);

    this.aFauth.auth.currentUser.updateProfile(
      {
        displayName: usuario.displayName,
        photoURL: usuario.photoURL
      }
    ).then(function (data) {
      console.log(data);

    }).catch(function (err) {
      console.error(err);

    })
  }

}
