import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicamentoService } from '../../services/medicamento.service';
import { Subscription } from 'rxjs';
import { IMedicamento } from '../../models/interfaces/medicamento.interface';
 
@Component({
  selector: 'app-medicamento',
  templateUrl: './medicamento.page.html',
  styleUrls: ['./medicamento.page.scss'],
})
export class MedicamentoPage implements OnInit, OnDestroy {
  public id: string;
  public medicamento: IMedicamento;
  public cantidad = 1;
  private subscription$ = new Subscription();
 
  constructor(private route: ActivatedRoute, private router: Router, private medService: MedicamentoService) {
    this.id = this.route.snapshot.paramMap.get('id');
  }
 
  ngOnInit() {
    this.getMedicamento();
  }
 
  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
 
  public comprar(): void {
 
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
    }, (e) => {
      this.router.navigateByUrl('/home');
    }));
  }
 
}
