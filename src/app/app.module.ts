import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { LoginPage } from '../pages/login/login';
import { AmigosProvider } from '../providers/amigos/amigos';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// import { RANGE_VALUE_ACCESSOR } from '@angular/forms/src/directives/range_value_accessor';

// AngularFire2 
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireAuth } from "angularfire2/auth";
import { FIREBASE_CONFIG } from './app.firebase.config';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { SalasPage } from '../pages/salas/salas';
import { RegistrarSalaPage } from '../pages/registrar-sala/registrar-sala';
import { SalasProvider } from '../providers/salas/salas';
import { ConversaPage } from '../pages/conversa/conversa';
import { ConversasProvider } from '../providers/conversas/conversas';
import { ConfiguracoesPage } from '../pages/configuracoes/configuracoes';
import { UsuarioProvider } from '../providers/usuario/usuario';
import { ConfigSalaModalPage } from '../pages/config-sala-modal/config-sala-modal';
import { AmigosPage } from '../pages/amigos/amigos';
import { AdicionarAmigoModalPage } from '../pages/adicionar-amigo-modal/adicionar-amigo-modal';

import { Geolocation } from '@ionic-native/geolocation';
import { Geofence } from '@ionic-native/geofence';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';


import { MapaPage } from '../pages/mapa/mapa';
import { MapsProvider } from '../providers/maps/maps';
import { ImagensProvider } from '../providers/imagens/imagens';
import { ArquivosProvider } from '../providers/arquivos/arquivos';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    TabsPage,
    SalasPage,
    RegistrarSalaPage,
    ConversaPage,
    ConfiguracoesPage,
    ConfigSalaModalPage,
    AmigosPage,
    AdicionarAmigoModalPage,
    MapaPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    TabsPage,
    SalasPage,
    RegistrarSalaPage,
    ConversaPage,
    ConfiguracoesPage,
    ConfigSalaModalPage,
    AmigosPage,
    AdicionarAmigoModalPage,
    MapaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AmigosProvider,
    SalasProvider,
    ConversasProvider,
    UsuarioProvider,
    Geofence,
    Geolocation,
    MapsProvider,
    Camera,
    ImagensProvider,
    FileChooser,
    File,
    ArquivosProvider
  ]
})
export class AppModule { }
