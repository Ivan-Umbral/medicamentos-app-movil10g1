import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserLoginRequest, ILoginResponse, IRefreshTokenRequest, IRefreshTokenResponse } from '../models/interfaces/login.interface';
import { Observable, from, of } from 'rxjs';
import { StorageService } from '../../shared/services/storage.service';
import { Router } from '@angular/router';
import { tap, map, catchError } from 'rxjs/operators';
import { IUsernameExists, ICorreoExists, IUserRegistroRequest } from '../models/interfaces/registro.interface';
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MenuController, NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLogged = false;
  public user: ILoginResponse;

  constructor(
      private http: HttpClient, private storage: StorageService,
      private router: Router, private navCtrl: NavController,
      private menu: MenuController,
    ) {}

  public login(body: IUserLoginRequest): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('/auth/login', body);
  }

  public async saveSession(session: ILoginResponse): Promise<boolean> {
    const saved = await this.storage.saveSession(session);
    if (saved) {
      this.user = session;
    }
    this.isLogged = saved;
    return saved;
  }

  public async logout(): Promise<void> {
    const destroyed = await this.storage.logout();
    if (destroyed) {
      this.isLogged = !destroyed;
      this.user = null;
      this.router.navigateByUrl('auth/login', { replaceUrl: true });
    } else {
      this.router.navigateByUrl('auth/login', { replaceUrl: true });
    }
  }

  public async logoutComponent(): Promise<boolean> {
    const destroyed = await this.storage.logout();
    if (destroyed) {
      this.isLogged = !destroyed;
      return true;
    }
    return false;
  }

  public async isAuthenticated(): Promise<boolean> {
    const isAuthenticated = await this.storage.userSessionExists();
    if (isAuthenticated) {
      this.user = await this.getUserSession();
    }
    this.isLogged = isAuthenticated;
    return isAuthenticated;
  }

  public async getUserSession(): Promise<ILoginResponse> {
    const payload = await this.storage.getUserSession();
    if (payload) { return payload; }
    return null;
  }

  public refreshToken(): Observable<IRefreshTokenResponse> {
    return from(this.refresh());
  }

  public testOlv(): Observable<string> {
    return this.http.get<string>('/usuarios');
  }

  public usernameExists(username: string): Observable<IUsernameExists> {
    return this.http.get<IUsernameExists>(`/perfiles/username/${username}`);
  }

  public correoExists(email: string): Observable<ICorreoExists> {
    return this.http.get<ICorreoExists>(`/perfiles/email/${email}`);
  }

  public isUsernameTaken(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      console.log('me estoy ejecutando alv');
      return this.usernameExists(control.value).pipe(
        map(resp => (resp.usernameExists ? { usernameExists: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  public userCreateOne(body: IUserRegistroRequest): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`/usuarios/movil`, body);
  }

  private async refresh(): Promise<IRefreshTokenResponse> {
    const userSession = await this.getUserSession();
    const refreshObj: IRefreshTokenRequest = {
      username: userSession.username,
      refreshToken: userSession.refreshToken,
    };
    return this.http.post<IRefreshTokenResponse>('/auth/refresh', refreshObj)
      .pipe(
        tap((data) => this.saveOnRefreshToken(data))
      )
      .toPromise();
  }

  private async saveOnRefreshToken(refreshTokenResponse: IRefreshTokenResponse): Promise<void> {
    const userSession = await this.getUserSession();
    userSession.accesToken = refreshTokenResponse.accessToken;
    userSession.refreshToken = refreshTokenResponse.refreshToken;
    await this.saveSession(userSession);
  }
}
