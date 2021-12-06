import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IMedicamento } from '../models/interfaces/medicamento.interface';
import { IPagoStripeRequest, IPagoStripeResponse } from '../models/interfaces/pago.interface';
 
@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {

  constructor(private http: HttpClient) { }

  public getPaginatedMeds(take = 5, skip = 0): Observable<IMedicamento[]> {
    return this.http.get<IMedicamento[]>(`/medicamentos/paginate?take=${take}&skip=${skip}`);
  }

  public getOne(id: string): Observable<IMedicamento> {
    return this.http.get<IMedicamento>(`/medicamentos/${id}`);
  }

  public createStripeOrder(body: IPagoStripeRequest): Observable<IPagoStripeResponse> {
    return this.http.post<IPagoStripeResponse>(`/ordenes/stripe-orden`, body);
  }
}
