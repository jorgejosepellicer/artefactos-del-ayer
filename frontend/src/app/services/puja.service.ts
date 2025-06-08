import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environment';
import { Puja } from '../interfaces/puja';

@Injectable({
  providedIn: 'root'
})
export class PujaService {

  constructor(private httpClient: HttpClient) { }

  API_ENDPOINT = environment.apiUrl + 'pujas/';

  getAll(): Observable<Puja[]> { //Devuelve todas las pujas.
    return this.httpClient.get<any>(this.API_ENDPOINT).pipe(
      map(data =>
        data.pujas.records.map((record: any[]) => ({
          id_puja: record[0],
          precio: record[1],
          id_usuario: record[2],
          id_producto: record[3],
        } as Puja))
      )
    );
  }

  getById(id: number): Observable<Puja | null> { //Devuelve la puja pasada como propiedad.
    return this.httpClient.get<any>(this.API_ENDPOINT + id).pipe(
      map(data =>
        data != null ? {
          id_puja: data.id_puja,
          precio: data.precio,
          id_usuario: data.id_usuario,
          id_producto: data.id_producto,
        } as Puja : null
      )
    );
  }

  getByUserId(userId: number): Observable<Puja[]> { //Devuelve todas las pujas hechas por el usuario pasado como propiedad.
    return this.httpClient.get<any>(`${this.API_ENDPOINT}?filter=id_usuario,eq,${userId}`).pipe(
      map(data =>
        data.pujas.records.map((record: any[]) => ({
          id_puja: record[0],
          precio: record[1],
          id_usuario: record[2],
          id_producto: record[3],
        } as Puja))
      )
    );
  }

  getByProductId(productId: number): Observable<Puja[]> { //Devuelve todas las pujas del producto pasado como propiedad.
    return this.httpClient.get<any>(`${this.API_ENDPOINT}?filter=id_producto,eq,${productId}`).pipe(
      map(data =>
        data.pujas.records.map((record: any[]) => ({
          id_puja: record[0],
          precio: record[1],
          id_usuario: record[2],
          id_producto: record[3],
        } as Puja))
      )
    );
  }

  getUserBidOfProduct(userId: number, productId: number): Observable<Puja | null> {
    return this.httpClient.get<any>(
      `${this.API_ENDPOINT}?filter=id_usuario,eq,${userId}`).pipe(
      map(response => {
        const records: any[][] = response.pujas.records;
        const columns: string[] = response.pujas.columns;

        const pujas: Puja[] = records.map(record => {
          const puja: any = {};
          columns.forEach((col, index) => {
            puja[col] = record[index];
          });
          return puja as Puja;
        });

        const pujaDelProducto = pujas.find(puja => puja.id_producto === productId);
        return pujaDelProducto ?? null;
      })
    );
  }



  post(puja: Puja) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.API_ENDPOINT, puja, { headers: headers });
  }

  put(puja: Puja) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put(this.API_ENDPOINT + '/' + puja.id_puja, puja, { headers: headers });
  }

  delete(puja: Puja) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.delete(this.API_ENDPOINT + '/' + puja.id_puja, { headers: headers });
  }
}
