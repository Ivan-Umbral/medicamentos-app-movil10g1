import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { IMedicamento } from '../../../medicamento/models/interfaces/medicamento.interface';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-medicamento',
  templateUrl: './medicamento.component.html',
  styleUrls: ['./medicamento.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MedicamentoComponent implements OnInit {
  @Input() public medicamentos: IMedicamento[];
  public config: SwiperOptions = {
    slidesPerView: 1.5,
    spaceBetween: 0,
    navigation: true,
  };
  constructor(private router: Router) { }
 
  ngOnInit() {}
 
  public navigate(id: number): void {
    this.router.navigateByUrl(`/medicamentos/detalle/${id}`);
  }
 
}
