import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicamentoService } from '../../services/medicamento.service';
import { Subscription } from 'rxjs';
import { IMedicamento } from '../../models/interfaces/medicamento.interface';
import { ModalController } from '@ionic/angular';
import { PagoModalComponent } from '../../components/pago-modal/pago-modal.component';
import { IPagoModal } from '../../models/interfaces/pago.interface';
import { TipoPagoEnum } from '../../models/enums/tipo-pago.enum';
import { AuthService } from '../../../auth/services/auth.service';
 
@Component({
  selector: 'app-medicamento',
  templateUrl: './medicamento.page.html',
  styleUrls: ['./medicamento.page.scss'],
})
export class MedicamentoPage implements OnInit, OnDestroy {
  public id: string;
  public medicamento: IMedicamento;
  public cantidad = 1;
  public precio = 0;
  private subscription$ = new Subscription();
 
  constructor(
      private route: ActivatedRoute, private router: Router,
      private medService: MedicamentoService, private modalCtrl: ModalController,
      private authService: AuthService,
    ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }
 
  ngOnInit() {
    this.getMedicamento();
  }
 
  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
 
  public async comprar(): Promise<void> {
    const data: IPagoModal = {
      cantidad: this.cantidad,
      medicamentoId: parseInt(this.id, 10),
      tipoPago: TipoPagoEnum.cc,
      total: this.precio,
      usuarioId: this.authService.user.id,
      medicamentoName: this.medicamento.nombre
    };
    const modal = await this.modalCtrl.create({
      component: PagoModalComponent,
      componentProps: {
        preOrderObject: data,
      },
    });
    return await modal.present();
  }
 
  onChange(e: any): void {
    this.cantidad = e.detail.value;
    this.precio = this.medicamento.precio * e.detail.value;
  }
 
  substractCantidad(): void {
    if (this.cantidad === 1) {
      return;
    }
    this.cantidad--;
  }
 
  addCantidad(): void {
    if (this.cantidad === this.medicamento.stock) {
      return;
    }
    this.cantidad++;
  }
 
  private getMedicamento(): void {
    this.subscription$.add(this.medService.getOne(this.id).subscribe(data => {
      this.medicamento = data;
      this.precio = data.precio;
    }, (e) => {
      this.router.navigateByUrl('/home');
    }));
  }
}
