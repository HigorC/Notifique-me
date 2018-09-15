import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UsuarioProvider } from '../usuario/usuario';

@Injectable()
export class SalasProvider {

  private PATH = 'salas/';
  private aba = this;
  salasRef: AngularFireList<any>;
  salas: Observable<any[]>;

  constructor(private db: AngularFireDatabase, private usuarioProvider: UsuarioProvider) {
    this.salasRef = this.db.list('salas');
    this.salas = this.salasRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  getAll() {
    return this.salas;
  };

  getAllNaoBloqueadas(keyUsuario) {
    this.db.database.ref('salas/').once('value').then(function (salas) {
      salas.forEach(function (sala) {
        console.log('---');
        console.log(sala.val());
      });
    });
  }

  get(key: string) {
    return this.db.object('salas/' + key).valueChanges();
  };

  save(sala: any) {
    this.salasRef.push(sala);
  };

  remove(key: string) {
    this.removerTodosUsuariosDeUmaSala(key);
  };

  getMensagens(keySala) {
    return this.db.list('salas/' + keySala + '/mensagens/').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  };

  enviarMensagem(KeySala, mensagem) {
    this.db.list('salas/' + KeySala + '/mensagens/').push(mensagem);
  };

  getUsuario(keyUsuario, keySala) {
    return this.db.object('salas/' + keySala + '/usuarios/' + keyUsuario).snapshotChanges();
  };

  getUsuariosDeUmaSalaComListener(keySala) {
    return this.db.list('salas/' + keySala + '/usuarios').valueChanges();
  };

  getAllUsuariosDeUmaSalaSemListener(keySala) {
    return this.db.database.ref('salas/' + keySala + '/usuarios').once('value');
  };



  async getArrayAllUsuariosKeysDeUmaSalaSemListener(keySala) {
    const that = this;

    let arrayAllUsuarios = [];

    return this.getAllUsuariosDeUmaSalaSemListener(keySala).then(function (usuarios) {

      const escopoSL = this;

      usuarios.forEach(function (usuarioSala) {
        const escopoUsuariosSala = this;
        console.log(usuarioSala);
        const obj_1 = usuarioSala;

        let usuario = that.usuarioProvider.getUsuarioPorId(usuarioSala.key).then(function (usuario: any) {
          return usuario;
        }).then(function (usuario) {
          return usuario;
        });

        usuario.then(function (u) {
          arrayAllUsuarios.push(
            { nome: u.val().nome,
              email: u.val().email,
              bloqueado: usuarioSala.val().bloqueado
             }
            );
          that.usuarioProvider;
          console.log(u);
          console.log(usuarioSala);
        })
      })

      // return Object.keys(usuarios.val()).forEach(function (keay) {
      // that.usuarioProvider.getUsuarioPorId(key).then(function (u) {
      //   console.log(u);

      //   u.val().nome
      // });
      // console.log('s');

      // usuarios.val()[i]
      // });
    }).then(function(res){
      console.log(res);
      console.log(arrayAllUsuarios);

      return arrayAllUsuarios;
    
    });
  }

  isSalaVazia(keySala) {
    return this.db.database.ref('salas/' + keySala + '/usuarios/').orderByChild('bloqueado').equalTo(false).once('value').then(function (res) {
      return res.val() === null
    });
  };

  bloquearUsuarioDeUmaSala(keyUsuario, keySala) {
    this.db.object('salas/' + keySala + '/usuarios/' + keyUsuario).update({ bloqueado: true });
  };

  removerTodosUsuariosDeUmaSala(keySala) {
    const that = this;
    this.getAllUsuariosDeUmaSalaSemListener(keySala).then(function (usuarios) {
      usuarios.forEach(function (childSnapshot) {
        that.bloquearUsuarioDeUmaSala(childSnapshot.key, keySala);
        // Apenas remove a sala do banco de dados se todos os usuarios forem expulsos antes
        that.isSalaVazia(keySala).then(function (res) {
          if (res) {
            that.db.list(that.PATH).remove(keySala);
          }
        });
      });
    });
  };

  async salaTemUsuario(keySala, keyUsuario) {
    return await this.db.database.ref('salas/' + keySala + '/usuarios/').orderByKey().equalTo(keyUsuario).once('value').then(function (snapshot) {
      return snapshot.val() !== null;
    });
  };

  async cadastrarUsuarioNaSala(keySala, keyUsuario) {
    const that = this;
    this.salaTemUsuario(keySala, keyUsuario).then(function (usuarioEstaNaSala) {
      if (!usuarioEstaNaSala) {

        that.db.object('salas/' + keySala + '/usuarios/' + keyUsuario).update({ bloqueado: false });

        console.log('usuario cadastrado');
      } else {
        console.log('ja existe');
      }
    })

  };
}
