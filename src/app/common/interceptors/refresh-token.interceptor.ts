import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, from } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

    refreshTokenInProgress = false;
    accessTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return from(this.handle(req, next));
    }

    public async handle(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
      const isAuthenticaded = await this.authService.isAuthenticated();
      return next.handle(req).pipe(
        catchError((e: HttpErrorResponse) => {
          if (e instanceof HttpErrorResponse && e.status === 401 && isAuthenticaded) {
            if (!this.refreshTokenInProgress) {
                this.refreshTokenInProgress = true;
                this.accessTokenSubject.next(null);
                return this.authService.refreshToken().pipe(
                    switchMap(authResponse => {
                      this.refreshTokenInProgress = false;
                      this.accessTokenSubject.next(authResponse.accessToken);
                      req = req.clone({
                        setHeaders: {
                          authorization: `Bearer ${authResponse.accessToken}`
                        }
                      });
                      return next.handle(req);
                    }),
                    catchError((refreshError: HttpErrorResponse) => {
                      this.refreshTokenInProgress = false;
                      this.authService.logout();
                      return throwError(refreshError);
                    })
                );
            } else {
              return this.accessTokenSubject.pipe(
                filter(accesToken => accesToken !== null),
                take(1),
                switchMap(token => {
                  req = req.clone({
                    setHeaders: {
                        authorization: `Bearer ${token}`
                    }
                  });
                  return next.handle(req);
                })
              );
            }
          }
          return throwError(e);
        })
      ).toPromise();
    }
}
