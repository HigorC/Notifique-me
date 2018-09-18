import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { Observable } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';
import { UsuarioProvider } from '../usuario/usuario';

@Injectable()
export class SalasProvider {

  private PATH = 'salas/';
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

  async getAllNaoBloqueadas() {

    const keyUsuarioAtual = this.usuarioProvider.getIdUsuarioAtual();
    let retorno;
    let arraySalasDisponiveis = [];

    // return this.getAll().forEach(function (salas) {
    //   retorno = salas.filter(function (sala) {

    //     if (sala.usuarios[keyUsuarioAtual] && sala.usuarios[keyUsuarioAtual].bloqueado === false) {

    //       return sala.usuarios[keyUsuarioAtual].bloqueado === false
    //     }

    //   })
    //   return retorno;
    // })

    return this.db.database.ref('salas/').once('value').then(function (salas) {
      salas.forEach(function (sala: any) {
        // console.log(sala.val());
        if (!sala.val().usuarios || !sala.val().usuarios[keyUsuarioAtual] || sala.val().usuarios[keyUsuarioAtual].bloqueado === false) {

          let s = sala.val();
          s.key = sala.key;
          arraySalasDisponiveis.push(s);
        }
      })

    }).then(function (res) {
      // console.log(res);
      return arraySalasDisponiveis;

    })


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



  async getArrayAllUsuariosDeUmaSalaSemListener(keySala) {
    const that = this;

    let arrayAllUsuarios = [];

    return this.getAllUsuariosDeUmaSalaSemListener(keySala).then(function (usuarios) {

      usuarios.forEach(function (usuarioSala) {
        let usuario = that.usuarioProvider.getUsuarioPorId(usuarioSala.key).then(function (usuario: any) {
          return usuario;
        }).then(function (usuario) {
          return usuario;
        });

        usuario.then(function (u) {
          if (u.key !== that.usuarioProvider.getIdUsuarioAtual()) {
            arrayAllUsuarios.push(
              {
                key: u.key,
                nome: u.val().nome,
                email: u.val().email,
                bloqueado: usuarioSala.val().bloqueado
              }
            );
          }
        })
      })
    }).then(function (res) {
      return arrayAllUsuarios;
    });
  }

  isSalaVazia(keySala) {
    return this.db.database.ref('salas/' + keySala + '/usuarios/').orderByChild('bloqueado').equalTo(false).once('value').then(function (res) {
      return res.val() === null
    });
  };

  alterarBloqueioDeUmUsuarioDeUmaSala(keyUsuario, keySala, bloqueio) {
    this.db.object('salas/' + keySala + '/usuarios/' + keyUsuario).update({ bloqueado: bloqueio });
  };

  removerTodosUsuariosDeUmaSala(keySala) {
    const that = this;
    this.getAllUsuariosDeUmaSalaSemListener(keySala).then(function (usuarios) {
      usuarios.forEach(function (childSnapshot) {
        that.alterarBloqueioDeUmUsuarioDeUmaSala(childSnapshot.key, keySala, true);
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
