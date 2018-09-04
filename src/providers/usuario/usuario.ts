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
    this.usuariosRef = this.db.list('salas');
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
    // let usuarioSimplificado: User;
    let usuarioCompleto = this.getUsuarioAtual();

    usuarioSimplificado.email = usuarioCompleto.email;
    usuarioSimplificado.displayName = usuarioCompleto.displayName;
    usuarioSimplificado.photoURL = usuarioCompleto.photoURL;

    return usuarioSimplificado;
  }


  async registrarNovoUsuario(usuario: User) {
    try {
      let result = await this.aFauth.auth.createUserWithEmailAndPassword(usuario.email, usuario.senha).then(function (data) {
        // console.log('>>> ' + data);
        // this.db.list('usuarios/' + data.user + '/mensagens/').push(mensagem);
      });
      // console.log(result);
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
