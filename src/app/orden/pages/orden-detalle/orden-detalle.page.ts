import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IOrdenFullResponse } from '../../models/interfaces/orden.interface';
import { OrdenService } from '../../services/orden.service';

@Component({
  selector: 'app-orden-detalle',
  templateUrl: './orden-detalle.page.html',
  styleUrls: ['./orden-detalle.page.scss'],
})
export class OrdenDetallePage implements OnInit, OnDestroy {

  public ordenFull: IOrdenFullResponse;
  private usuarioId: string;
  private ordenId: string;
  private subscription$ = new Subscription();

  constructor(private route: ActivatedRoute, private router: Router, private ordenService: OrdenService) {
    this.usuarioId = this.route.snapshot.paramMap.get('userId');
    this.ordenId = this.route.snapshot.paramMap.get('ordenId');
  }

  ngOnInit() {
    this.getFullOrden();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  private getFullOrden(): void {
    this.subscription$.add(this.ordenService.getOneByUserId(this.usuarioId, this.ordenId).subscribe(data => {
      this.ordenFull = data;
    }, (e) => {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }));
  }
}
