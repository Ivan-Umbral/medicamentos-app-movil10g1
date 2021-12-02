import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.handle(req, next));
    }

    async handle(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
        if (await this.authService.isAuthenticated()) {
          const accessToken = await this.authService.getUserSession();
          req = req.clone({
            setHeaders: {
              authorization: `Bearer ${accessToken.accesToken}`
            }
          });
        }
        return next.handle(req).toPromise();
    }
}
