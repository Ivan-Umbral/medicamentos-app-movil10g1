import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { MedicamentoService } from '../medicamento/services/medicamento.service';
import { IMedicamento } from '../medicamento/models/interfaces/medicamento.interface';
import { Subscription } from 'rxjs';
 
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  public medicamentosOne: IMedicamento[] = [];
  public medicamentosTwo: IMedicamento[] = [];
  private subscription$ = new Subscription();
 
  constructor(private authService: AuthService, private medService: MedicamentoService) { }
 
  ngOnInit() {
  }
 
  ionViewWillEnter(): void {
    this.getPaginatedMeds();
    this.getPaginatedMeds(5, 5);
  }
 
  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
 
  private getPaginatedMeds(take = 5, skip = 0): void {
    this.subscription$.add(this.medService.getPaginatedMeds(take, skip).subscribe(data => {
      if (skip > 0) {
        this.medicamentosTwo = data;
      } else {
        this.medicamentosOne = data;
      }
    }, (e) => {
    }));
  }
 
  /* async ionViewWillEnter() {
  } */
 
}
