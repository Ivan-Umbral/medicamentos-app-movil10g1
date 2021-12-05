import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { CustomValidations } from '../../../common/security/custom-validations/custom-validations';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';
import { ILoginResponse } from '../../models/interfaces/login.interface';
import { IUserRegistroRequest } from '../../models/interfaces/registro.interface';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit, OnDestroy {

  public form: FormGroup;
  public subscription$ = new Subscription();

  constructor(
    private fb: FormBuilder, private authService: AuthService,
    private router: Router, private alertService: AlertService,
    private navCtrl: NavController,
    ) {
    this.createForm();
  }

  ngOnInit() {
    const username = this.form.get('username');
    const email = this.form.get('correoElectronico');
    this.subscription$.add(username.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(data => {
      if (typeof data === 'string' && username.valid) {
        this.usernameRepeated(data.trim());
      }
    }));
    this.subscription$.add(email.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(data => {
      if (typeof data === 'string' && email.valid) {
        this.emailRepeated(data.trim());
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  public registroOnSubmit(): void {
    if (this.form.valid) {
      this.register();
    } else {
      this.alertService.showAlert('Error', 'El formulario no es válido');
    }
  }

  //#region Form Getters

  public get isNombreValid(): boolean {
    const nombreField = this.form.get('nombre');
    return nombreField.invalid && nombreField.dirty;
  }

  public get isApellidoPaternoValid(): boolean {
    const apellidoPaternoField = this.form.get('apellidoPaterno');
    return apellidoPaternoField.invalid && apellidoPaternoField.dirty;
  }

  public get isApellidoMaternoValid(): boolean {
    const apellidoMaternoField = this.form.get('apellidoMaterno');
    return apellidoMaternoField.invalid && apellidoMaternoField.dirty;
  }

  public get isTelefonoValid(): boolean {
    const telefonoField = this.form.get('telefono');
    return telefonoField.invalid && telefonoField.dirty;
  }

  public get isEmailValid(): boolean {
    const emailField = this.form.get('correoElectronico');
    return emailField.invalid && emailField.dirty;
  }

  public get isUsernameValid(): boolean {
    const usernameField = this.form.get('username');
    return usernameField.invalid && usernameField.dirty;
  }

  public get isPasswordValid(): boolean {
    const passwordField = this.form.get('contrasena');
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
        case 'onlyNumbers':
          errorMessage = `Este campo solo acepta números.`;
          break;
        case 'alpha':
          errorMessage = 'Este campo solo acepta letras y números sin espacios.';
          break;
        case 'email':
            errorMessage = 'Este campo debe contener un correo electrónico.';
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
        case 'usernameExists':
          errorMessage = `Ups! Este nombre de usuario ya está en uso, intente con otro distinto.`;
          break;
        case 'correoExists':
          errorMessage = `Ups! Este correo electrónico ya está en uso, intente con otro distinto.`;
          break;
        default:
          errorMessage = '';
          break;
      }
    }
    return errorMessage;
  }
  //#endregion

  private createForm(): void {
    this.form = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        CustomValidations.onlyLetters,
        CustomValidations.twoBlanks,
        CustomValidations.sqlInjection
      ]],
      apellidoPaterno: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        CustomValidations.onlyLetters,
        CustomValidations.twoBlanks,
        CustomValidations.sqlInjection
      ]],
      apellidoMaterno: ['', [
        Validators.minLength(3),
        Validators.maxLength(30),
        CustomValidations.onlyLetters,
        CustomValidations.twoBlanks,
        CustomValidations.sqlInjection
      ]],
      telefono: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        CustomValidations.onlyNumbers
      ]],
      /* username: ['', {
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
          CustomValidations.alphaMx,
          CustomValidations.sqlInjection
        ],
        asyncValidators: null,
        updateOn: 'blur'
      }], */
      username: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        CustomValidations.alphaMx,
        CustomValidations.sqlInjection
      ]],
      contrasena: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
        CustomValidations.blank,
        CustomValidations.sqlInjection
      ]],
      correoElectronico: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        Validators.email
      ]]
    });
  }

  private async register(): Promise<void> {
    await this.alertService.showLoading('Registrando espere...');
    this.subscription$.add(this.authService.userCreateOne(this.createUserRequest()).subscribe(data => {
      this.alertService.dismissLoading();
      this.saveSession(data);
    }, (e) => {
      this.alertService.dismissLoading();
      this.alertService.showAlert('Error', 'Algo salió mal, intenta más tarde');
    }));
  }

  private createUserRequest(): IUserRegistroRequest {
    const user: IUserRegistroRequest = {
      nombre: this.form.value.nombre,
      apellidoPaterno: this.form.value.apellidoPaterno,
      apellidoMaterno: (this.form.value.apellidoMaterno.length > 0 ? this.form.value.apellidoMaterno : null),
      telefono: this.form.value.telefono,
      perfil: {
        correoElectronico: this.form.value.correoElectronico,
        username: this.form.value.username,
        contrasena: this.form.value.contrasena
      }
    };
    return user;
  }

  private async saveSession(data: ILoginResponse): Promise<void> {
    const saved = await this.authService.saveSession(data);
    if (saved) {
      /* this.router.navigateByUrl('/home'); */
      this.navCtrl.navigateRoot('/home');
    } else {
      await this.alertService.showAlert('Error', 'Algo salió mal al guardar tu sesión, por favor intenta más tarde.');
      this.router.navigateByUrl('/auth/login');
    }
  }

  private usernameRepeated(username: string) {
    this.subscription$.add(this.authService.usernameExists(username).subscribe(data => {
      if (data.usernameExists) {
        this.setError('username', { usernameExists: true });
      } else {
        this.setError('username', null);
      }
    }, (e) => {
      this.setError('username', null);
    }));
  }

  private emailRepeated(email: string) {
    this.subscription$.add(this.authService.correoExists(email).subscribe(data => {
      if (data.correoExists) {
        this.setError('correoElectronico', { correoExists: true });
      } else {
        this.setError('correoElectronico', null);
      }
    }, (e) => {
      this.setError('correoElectronico', null);
    }));
  }

  private setError(fieldname: string, error: ValidationErrors | null) {
    this.form.get(fieldname).setErrors(error);
  }

}
