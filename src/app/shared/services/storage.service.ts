import { Injectable } from '@angular/core';
import { ILoginResponse } from '../../auth/models/interfaces/login.interface';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /* private storageRef: Storage; */

  constructor(private storage: Storage) {
    this.init();
  }

  public saveSession(sessionObject: ILoginResponse): Promise<boolean> {
    /* return this.nativeStorage.setItem('user', sessionObject).then(
      () => true,
      (e) => false,
    ); */
    return this.storage.set('user', sessionObject).then(
      () => true,
      (e) => false,
    );
  }

  public logout(): Promise<boolean> {
    /* return this.nativeStorage.remove('user').then(
      () => true,
      (e) => false,
    ); */
    return this.storage.remove('user').then(
      () => true,
      (e) => false,
    );
  }

  public getUserSession(): Promise<ILoginResponse> {
    /* return this.nativeStorage.getItem('user').then(
      (data: ILoginResponse) => data,
      (e) => null,
    ); */
    return this.storage.get('user').then(
      (data: ILoginResponse) => data,
      (e) => null,
    );
  }

  public async userSessionExists(): Promise<boolean> {
    const user = await this.getUserSession();
    return  user !== null;
  }

  private async init() {
    await this.storage.create();
    /* console.log(storage);
    console.log(this.storageRef);
    this.storageRef = storage; */
  }
}
