import { AbstractControl, AsyncValidator, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../../../auth/services/auth.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UsernameAsyncValidation {
  constructor(private authService: AuthService) {}
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    console.log('me estoy ejecutando alv');
    return this.authService.usernameExists(control.value).pipe(
        map(resp => (resp.usernameExists ? { usernameExists: true } : null)),
        catchError(() => of(null))
      );
  }
  registerOnValidatorChange?(fn: () => void): void {}

  usernameExists(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      console.log('me estoy ejecutando alv');
      return this.authService.usernameExists(control.value).pipe(
        map(resp => (resp.usernameExists ? { usernameExists: true } : null)),
        catchError(() => of(null))
      );
    };
  }
}
