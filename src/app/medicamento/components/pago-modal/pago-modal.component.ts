import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IPagoModal, IPagoStripeRequest, IPagoStripeResponse } from '../../models/interfaces/pago.interface';
import { CustomValidations } from '../../../common/security/custom-validations/custom-validations';
import { Stripe, StripeCardTokenRes } from '@ionic-native/stripe/ngx';
import { AlertService } from '../../../shared/services/alert.service';
import { Subscription } from 'rxjs';
import { MedicamentoService } from '../../services/medicamento.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-pago-modal',
  templateUrl: './pago-modal.component.html',
  styleUrls: ['./pago-modal.component.scss'],
})
export class PagoModalComponent implements OnInit, OnDestroy {

  @Input() preOrderObject: IPagoModal;
  public form: FormGroup;
  public isLoading = false;
  private subscription$ = new Subscription();

  constructor(
    private modalCtrl: ModalController, private fb: FormBuilder,
    private stripe: Stripe, private alertService: AlertService,
    private medService: MedicamentoService, private router: Router,
  ) { }

  ngOnInit() {
    if (this.preOrderObject) {
      this.stripe.setPublishableKey(environment.stripePublishKey);
      this.createForm();
    }
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  closeModal(): void {
    this.modalCtrl.dismiss();
  }

  async pay(): Promise<void> {
    if (this.form.valid) {
      this.isLoading = true;
      const isCreditCardNumberValid = await this.isCreditCardNumberValid();
      const isExpDateValid = await this.isExpDateValid();
      const isCvcValid = await this.isCvcCardValid();
      if (!isCreditCardNumberValid) {
        await this.alertService.showAlert('Error', 'El número de tarjeta no es válido.');
        this.isLoading = false;
      } else if (!isExpDateValid) {
        await this.alertService.showAlert('Error', `
        La fecha de expiración (mes o año) no son válidos, muy probablemente la fecha ya venció.
        `);
        this.isLoading = false;
      } else if (!isCvcValid) {
        await this.alertService.showAlert('Error', 'El CVC de la tarjeta no es válido');
        this.isLoading = false;
      } else {
        const card = await this.createCardToken();
        if (card) {
          this.createOrder(card);
        } else {
          await this.alertService.showAlert('Error', 'No se pudo crear el token de seguridad para la tarjeta, intenta más tarde.');
          this.isLoading = false;
        }
      }
    } else {
      this.alertService.showAlert('Error', 'Formulario inválido');
    }
  }

  async isCreditCardNumberValid(): Promise<boolean> {
    return this.stripe.validateCardNumber(this.form.value.creditCardNumber)
      .then(
        () => true,
        () => false,
      );
  }

  async isExpDateValid(): Promise<boolean> {
    return this.stripe.validateExpiryDate(
      this.form.value.expMonth,
      this.form.value.expYear
    ).then(
      () => true,
      () => false,
    );
  }

  async isCvcCardValid(): Promise<boolean> {
    return this.stripe.validateCVC(this.form.value.cvc)
      .then(
        () => true,
        () => false,
      );
  }

  //#region Form getters
  public get isCreditCardValid(): boolean {
    const field = this.form.get('creditCardNumber');
    return field.invalid && field.dirty;
  }

  public get isExpMonthValid(): boolean {
    const field = this.form.get('expMonth');
    return field.invalid && field.dirty;
  }

  public get isExpYearValid(): boolean {
    const field = this.form.get('expYear');
    return field.invalid && field.dirty;
  }

  public get isCvcValid(): boolean {
    const field = this.form.get('cvc');
    return field.invalid && field.dirty;
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
        case 'onlyNumbers':
          errorMessage = `Este campo solo acepta números.`;
          break;
        case 'isExpYearLessThan':
          errorMessage = `El año de expiración no debe ser menor al año actual.`;
          break;
        case 'isExpMonthValid':
          errorMessage = `El mes de expiración debe tener un valor entre 1 y 12.`;
          break;
        case 'isExpYearMoreThan':
          errorMessage = `El año de expiración no debe ser mayor a 5 años.`;
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
      creditCardNumber: ['', [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(16),
        CustomValidations.onlyNumbers
      ]],
      expMonth: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2),
        CustomValidations.onlyNumbers,
        CustomValidations.creditCardExpMonthRange
      ]],
      expYear: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4),
        CustomValidations.onlyNumbers,
        CustomValidations.creditCardExpYear
      ]],
      cvc: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3),
        CustomValidations.onlyNumbers
      ]]
    });
  }

  private async createCardToken(): Promise<StripeCardTokenRes> {
    return this.stripe.createCardToken({
      // eslint-disable-next-line id-blacklist
      number: this.form.value.creditCardNumber,
      expMonth: parseInt(this.form.value.expMonth, 10),
      expYear: parseInt(this.form.value.expYear, 10),
      cvc: this.form.value.cvc
    }).then(
      (data) => data,
      () => null
    );
  }

  private async createOrder(card: StripeCardTokenRes): Promise<void> {
    const body = this.getAllObject(card);
    await this.alertService.showLoading('Procesando, espere...');
    this.subscription$.add(this.medService.createStripeOrder(body).subscribe((data) => {
      this.alertService.dismissLoading();
      this.isLoading = false;
      this.orderCreated(data);
    }, (e) => {
      this.alertService.dismissLoading();
      this.isLoading = false;
      this.alertService.showAlert('Error', 'Error al procesar el pago, intente más tarde.');
    }));
  }

  private async orderCreated(data: IPagoStripeResponse): Promise<void> {
    await this.alertService.showAlert('Ok', `Pago confirmado con id ${data.stripeChargeId}`);
    await this.modalCtrl.dismiss();
    this.router.navigateByUrl(`/ordenes/all/${data.usuario.id}`, { replaceUrl: true });
  }

  private getAllObject(card: StripeCardTokenRes): IPagoStripeRequest {
    const object: IPagoStripeRequest = {
      cantidad: this.preOrderObject.cantidad,
      medicamentoId: this.preOrderObject.medicamentoId,
      tipoPago: this.preOrderObject.tipoPago,
      total: this.preOrderObject.total,
      usuarioId: this.preOrderObject.usuarioId,
      payment: {
        amount: this.preOrderObject.total,
        description: this.preOrderObject.medicamentoName,
        token: card.id
      },
    };
    return object;
  }
}
