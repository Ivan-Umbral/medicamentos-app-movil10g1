import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrdenService } from '../../services/orden.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { IOrdenResponse } from '../../models/interfaces/orden.interface';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.page.html',
  styleUrls: ['./ordenes.page.scss'],
})
export class OrdenesPage implements OnInit, OnDestroy {

  public ordenes: IOrdenResponse[] = [];
  private subscription$ = new Subscription();
  private id: string;

  constructor(private ordenService: OrdenService, private route: ActivatedRoute, private router: Router) {
    this.id = this.route.snapshot.paramMap.get('userId');
  }

  ngOnInit() {
    this.getOrdenes();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  navigate(userId: number, ordenId: number): void {
    this.router.navigateByUrl(`/ordenes/detalle/${userId}/${ordenId}`);
  }

  private getOrdenes(): void {
    this.subscription$.add(this.ordenService.getAllByUserId(this.id).subscribe(data => {
      this.ordenes = data;
    }, (e) => {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }));
  }

}
