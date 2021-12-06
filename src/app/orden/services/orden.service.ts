import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOrdenResponse, IOrdenFullResponse } from '../models/interfaces/orden.interface';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  constructor(private http: HttpClient) { }

  public getAllByUserId(userId: string): Observable<IOrdenResponse[]> {
    return this.http.get<IOrdenResponse[]>(`/ordenes/all/${userId}`);
  }

  public getOneByUserId(userId: string, ordenId: string): Observable<IOrdenFullResponse> {
    return this.http.get<IOrdenFullResponse>(`/ordenes/one/${userId}/${ordenId}`);
  }
}
