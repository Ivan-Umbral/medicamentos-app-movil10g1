import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const apiEndpoint = environment.apiEndpoint;
        const reqClone = req.clone({ url: `${apiEndpoint}${req.url}` });
        return next.handle(reqClone);
    }
}
