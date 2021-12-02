import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../../shared/services/alert.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IUserLoginRequest, ILoginResponse } from '../../models/interfaces/login.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomValidations } from '../../../common/security/custom-validations/custom-validations';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  public form: FormGroup;
  private subscription = new Subscription();

  constructor(
      private fb: FormBuilder, private authService: AuthService,
      private alertService: AlertService, private router: Router,
    ) {
      this.createForm();
    }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loginOnSubmit(): void {
    if (this.form.valid) {
      this.login();
    } else {
      this.alertService.showAlert('Error', 'El formulario no es váido');
    }
  }

  aver(): void {
    this.router.navigateByUrl('/auth/registro');
  }

  //#region Form Getters
  public get isUsernameValid(): boolean {
    const usernameField = this.form.get('username');
    return usernameField.invalid && usernameField.dirty;
  }

  public get isPasswordValid(): boolean {
    const passwordField = this.form.get('password');
    return passwordField.invalid && passwordField.dirty;
  }

  public getErrorMessage(formControlName: string): string {
    const formControl = this.form.get(formControlName);
    let errorMessage = '';
    const formControlErrors = formControl.errors;
    if (formControlErrors) {
      const errors = Object.keys(formControl.errors);
      switch (errors[0]) {
        case 'required':
          errorMessage = 'Este campo es requerido.';
          break;
        case 'minlength':
          errorMessage = `Este campo debe contener al menos ${formControlErrors.minlength.requiredLength} caracteres.`;
          break;
        case 'maxlength':
          errorMessage = `Este campo no puede tener más de ${formControlErrors.minlength.requiredLength} caracteres.`;
          break;
        case 'onlyLetters':
          errorMessage = `Este campo solo acepta letras.`;
          break;
        case 'alpha':
          errorMessage = 'Este campo solo acepta letras y números sin espacios.';
          break;
        case 'blank':
          errorMessage = `Este campo no puede tener espacios.`;
          break;
        case 'twoBlanks':
          errorMessage = `Este campo no puede tener más de 1 espacio en blanco seguido.`;
          break;
        case 'sqlSintax':
          errorMessage = `Este campo tiene un conjunto de caracteres no permitidos.`;
          break;
        default:
          errorMessage = '';
          break;
      }
    }
    return errorMessage;
  }
  //#endregion

  private async login(): Promise<void> {
    await this.alertService.showLoading('Verificando...');
    const body: IUserLoginRequest = {
      username: this.form.value.username,
      password: this.form.value.password
    };
    this.subscription.add(this.authService.login(body).subscribe(data => {
      this.alertService.dismissLoading();
      this.saveSession(data);
    }, (e: HttpErrorResponse) => {
      this.alertService.dismissLoading();
      if (e.status === 401) {
        this.alertService.showAlert('Error', 'Usuario o contraseña incorrectos');
      } else {
        this.alertService.showAlert('Error', 'Algo salió mal, intenta más tarde');
      }
    }));
  }

  private async saveSession(data: ILoginResponse): Promise<void> {
    const saved = await this.authService.saveSession(data);
    if (saved) {
      this.router.navigateByUrl('/home');
    } else {
      this.alertService.showAlert('Error', 'Algo salió mal al guardar tu sesión, por favor intenta más tarde.');
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        CustomValidations.alphaMx,
        CustomValidations.sqlInjection
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
        CustomValidations.blank,
        CustomValidations.sqlInjection
      ]]
    });
  }
}
