import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ConversasProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConversasProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ConversasProvider Provider');
  }

}
