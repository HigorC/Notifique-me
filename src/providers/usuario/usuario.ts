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
    return this.aFauth.auth.currentUser
  }

  getUsuarioPorId(key) {
    return this.db.database.ref('usuarios/' + key).once('value');
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
    return this.getUsuarioAtual().uid;
  }

  logar(email, senha) {
    return this.aFauth.auth.signInWithEmailAndPassword(email, senha);
  }

  registrarNovoUsuario(usuario: User) {
    const that = this;
    return this.aFauth.auth.createUserWithEmailAndPassword(usuario.email, usuario.senha).then(function (data) {
      that.db.object('usuarios/' + data.user.uid).set({ nome: data.user.displayName, email: data.user.email });
    });
  }

  async atualizarUsuario(usuario) {

    console.log(usuario.displayName);
    this.db.object('usuarios/' + this.getIdUsuarioAtual()).update({ nome: usuario.displayName });
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

  getKeyUsuarioByEmail(email) {
    return this.db.database.ref('usuarios/').orderByChild('email').equalTo(email).once('value').then(function (res) {
      return res.val() ? Object.keys(res.val())[0] : null
    });
  }

  enviarConviteAmizade(email) {
    const that = this;
    this.getKeyUsuarioByEmail(email).then(function (key) {
      if (key) {
        that.db.list('usuarios/' + key + '/convites/').push({ key: that.getIdUsuarioAtual() });
      }
    });
  }

  getAllConvites() {
    // return this.db.list('usuarios/' + this.getIdUsuarioAtual() + '/convites/').valueChanges();
    const that = this;
    return this.db.list('usuarios/' + this.getIdUsuarioAtual() + '/convites/').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => (
          {
            // key: c.payload.key, ...c.payload.val(),
            u: that.getUsuarioPorId(c.payload.val().key).then(function(res){
              return res.val();
            })
          }
        ))
      )
    );
  }

}
