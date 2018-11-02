import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { Observable } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';
import { UsuarioProvider } from '../usuario/usuario';
import { MapsProvider } from '../maps/maps';
import { ImagensProvider } from '../imagens/imagens';


import { Geofence } from '@ionic-native/geofence';

@Injectable()
export class SalasProvider {

  private PATH = 'salas/';
  salasRef: AngularFireList<any>;
  salas: Observable<any[]>;

  constructor(
    private db: AngularFireDatabase,
    private usuarioProvider: UsuarioProvider,
    private mapsProvider: MapsProvider,
    private imagensProvider: ImagensProvider,
    private geofence: Geofence) {
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

  //  getAllNaoBloqueadas() {
  //   const that = this;
  //   const keyUsuarioAtual = this.usuarioProvider.getIdUsuarioAtual();
  //   let retorno;
  //   let arraySalasDisponiveis = {
  //     contSalas: 0,
  //     proximas: [],
  //     distantes: []
  //   };

  //   return this.db.database.ref('salas/').once('value').then(async function (salas) {
  //     await salas.forEach(function (sala: any) {
  //       if (!sala.val().usuarios || !sala.val().usuarios[keyUsuarioAtual] || sala.val().usuarios[keyUsuarioAtual].bloqueado === false) {
  //         let s = sala.val();
  //         s.key = sala.key;
  //         if (s.coordenadas) {

  //           that.imagensProvider.downloadImagem('/salas/', sala.key).then(res => {
  //             s.urlImgSala = res ? res : 'assets/imgs/group.png';
  //           });
  //           retorno = that.mapsProvider.calcularDistanciaFormula(s.coordenadas).then(function (distancia: any) {
  //             s.distancia = distancia;
  //             arraySalasDisponiveis.contSalas++;
  //             if (distancia <= s.raio) {
  //               that.salaTemAlgumAmigo(sala.key).then(function (res) {
  //                 s.temAmigo = res;
  //                 arraySalasDisponiveis.proximas.push(s);
  //               });
  //             } else {
  //               arraySalasDisponiveis.distantes.push(s);
  //             }
  //           })
  //         }
  //       }
  //     })
  //   }).then(function (res) {
  //       return arraySalasDisponiveis;
  //   })
  // }

  getAllSL() {
    return this.db.database.ref('salas/').once('value').then(function (salas) {
      return salas;
    })
  }

  get(key: string) {
    return this.db.object('salas/' + key).valueChanges();
  };

  // Get Sem Listener
  getSL(key: string) {
    return this.db.database.ref('salas/' + key).once('value');
  };

  getNomeSala(key) {
    // return this.db.database.ref('salas/' + key).once('value').then(sala =>{
    //   console.log(sala.val());

    // });
  }

  updateNomeSala(key, nome) {
    return this.db.object('salas/' + key).update({ nome: nome });
  }

  updateDescricaoSala(key, descricao) {
    return this.db.object('salas/' + key).update({ descricao: descricao });
  }

  getDescricaoSala(key) {
    return this.db.database.ref('salas/' + key + '/descricao').once('value');
  }

  save(sala: any) {
    return this.salasRef.push(sala);
  };

  remove(key: string) {
    this.removerTodosUsuariosDeUmaSala(key);
  };

  getMensagens(keySala) {

    const that = this;

    return this.db.list('salas/' + keySala + '/mensagens/').snapshotChanges().pipe(
      map(changes =>
        changes.map(function (c: any) {


          let retorno = { key: c.payload.key, ...c.payload.val() };


          // if (c.payload.val().imagem) {
          //   console.log('entrou');

          //   retorno.urlFoto = that.imagensProvider.downloadImagem('/salas/' + keySala + '/mensagens/', c.payload.key).then(res => {
          //     return res;
          //   })
          // }
          // console.log(retorno);

          return retorno;
        })
      )
    );
  };

  getKeyMensagem(KeySala) {
    return this.db.database.ref('salas/' + KeySala).child('mensagens').push().key;
  }

  enviarMensagem(KeySala, mensagem, keyMensagem?) {
    // SE VIER UMA KEY DE MENSAGEM QUER DIZER QUE A MENSAGME EM QUESTÃO É UMA FOTO, SENDO ASSIM
    // EU FAÇO O DOWNLOAD DA IMAGEM PARA MANDAR PARA O DATABASE REALTIME A URL JÁ CERTA
    if (keyMensagem) {
      this.imagensProvider.downloadImagem('/salas/' + KeySala + '/mensagens/', keyMensagem).then(res => {
        return this.db.object('salas/' + KeySala + '/mensagens/' + keyMensagem).update(Object.assign(mensagem, { urlFoto: res }));
      })
    } else {
      return this.db.list('salas/' + KeySala + '/mensagens/').push(mensagem);
    }
  };

  // adicionarUrlFotoAMensagem(keySala, keyMensagem) {
  //   this.imagensProvider.downloadImagem('/salas/' + keySala + '/mensagens/', keyMensagem).then(res => {
  //     this.db.object('salas/' + keySala + '/mensagens/' + keyMensagem).update({ urlFoto: res });
  //   })
  // }

  getUsuario(keyUsuario, keySala) {
    return this.db.object('salas/' + keySala + '/usuarios/' + keyUsuario).snapshotChanges();
  };

  getUsuariosDeUmaSalaComListener(keySala) {
    return this.db.list('salas/' + keySala + '/usuarios').valueChanges();
  };

  getAllUsuariosDeUmaSalaSemListener(keySala) {
    return this.db.database.ref('salas/' + keySala + '/usuarios').once('value');
  };

  getAllAmigosSemListener(keySala, keyUsuario?) {
    if (!keyUsuario) {
      keyUsuario = this.usuarioProvider.getIdUsuarioAtual();
    }

    return this.db.database.ref('usuarios/' + keyUsuario + '/amigos').once('value');
  };

  AmITheCreator(keySala) {
    return this.getSL(keySala).then(res => res.val().criador === this.usuarioProvider.getEmailUsuarioAtual());
  }


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
            that.imagensProvider.downloadImagem('/usuarios/', u.key).then(caminhoImagem => {
              arrayAllUsuarios.push(
                {
                  key: u.key,
                  nome: u.val().nome,
                  email: u.val().email,
                  bloqueado: usuarioSala.val().bloqueado,
                  urlImagemPerfil: caminhoImagem ? caminhoImagem : 'assets/imgs/friend.png'
                }
              );
            })
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

  async salaTemUsuario(keySala, keyUsuario?) {

    if (!keyUsuario) {
      keyUsuario = this.usuarioProvider.getIdUsuarioAtual();
    }
    return await this.db.database.ref('salas/' + keySala + '/usuarios/').orderByKey().equalTo(keyUsuario).once('value').then(function (snapshot) {

      let esta = snapshot.val() !== null;
      // console.log(keyUsuario + ' na sala ' + keySala + ' = ' + esta);

      return esta;
    });
  };

  getArrayAllAmigosSemListener(keySala) {
    const that = this;
    let arrayAmigos = [];

    return this.getAllAmigosSemListener(keySala).then(function (amigos) {
      amigos.forEach(function (amigo) {
        arrayAmigos.push({
          'keyDB': amigo.key,
          'keyAmigo': amigo.val().key
        })

      })
    }).then(function (res) {
      return arrayAmigos;
    })
  }

  salaTemAlgumAmigo(keySala) {
    const that = this;
    let retorno;

    return this.getArrayAllAmigosSemListener(keySala).then(function (amigos) {
      amigos.forEach(function (amigo) {
        retorno = that.salaTemUsuario(keySala, amigo.keyAmigo).then(function (amigoEstaNaSala) {
          if (amigoEstaNaSala) {
            return true;
          }
        })
      })
      return retorno;
    });
  }

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

  removerUsuarioDaSala(keySala, keyUsuario?) {
    this.db.list('salas/' + keySala + '/usuarios/').remove(keyUsuario ? keyUsuario : this.usuarioProvider.getIdUsuarioAtual());
  }
}
