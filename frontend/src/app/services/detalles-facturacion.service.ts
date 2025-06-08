import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environment';
import { DetallesFacturacion } from '../interfaces/detalles-facturacion';

@Injectable({
  providedIn: 'root'
})
export class DetallesFacturacionService {

  constructor(private httpClient: HttpClient) { }

  API_ENDPOINT = environment.apiUrl + 'detalles_facturacion/';

  getAll(): Observable<DetallesFacturacion[]> {
    return this.httpClient.get<any>(this.API_ENDPOINT).pipe(
      map(data =>
        data.detalles_facturacion.records.map((record: any[]) => ({
          id_detalle: record[0],
          id_usuario: record[1],
          nombre_completo: record[2],
          direccion: record[3],
          ciudad: record[4],
          provincia: record[5],
          codigo_postal: record[6],
          pais: record[7],
          nif_cif: record[8]
        } as DetallesFacturacion))
      )
    );
  }

  getById(id: number): Observable<DetallesFacturacion | null> {
    return this.httpClient.get<any>(this.API_ENDPOINT + id).pipe(
      map(data =>
        data != null ? {
          id_detalle: data.id_detalle,
          id_usuario: data.id_usuario,
          nombre_completo: data.nombre_completo,
          direccion: data.direccion,
          ciudad: data.ciudad,
          provincia: data.provincia,
          codigo_postal: data.codigo_postal,
          pais: data.pais,
          nif_cif: data.nif_cif
        } as DetallesFacturacion : null
      )
    );
  }

  getByUserId(userId: number): Observable<DetallesFacturacion> {
    return this.httpClient
      .get<any>(`${this.API_ENDPOINT}?filter=id_usuario,eq,${userId}`)
      .pipe(
        map(data => {
          const record = data.detalles_facturacion.records[0];
          if (!record) throw new Error("No se encontró detalle de facturación.");
          return {
            id_detalle: record[0],
            id_usuario: record[1],
            direccion: record[2],
            ciudad: record[3],
            provincia: record[4],
            codigo_postal: record[5],
            pais: record[6],
            nif_cif: record[7]
          } as DetallesFacturacion;
        })
      );
  }
  
  getPorUsuarioActual(): Observable<DetallesFacturacion> {
    // Suponiendo que el backend usa auth token y responde con los datos del usuario logueado
    return this.httpClient.get<any>(`${this.API_ENDPOINT}current`).pipe(
      map(data => ({
        id_detalle: data.id_detalle,
        id_usuario: data.id_usuario,
        nombre_completo: data.nombre_completo,
        direccion: data.direccion,
        ciudad: data.ciudad,
        provincia: data.provincia,
        codigo_postal: data.codigo_postal,
        pais: data.pais,
        nif_cif: data.nif_cif
      } as DetallesFacturacion))
    );
  }

  post(detalle: DetallesFacturacion): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.API_ENDPOINT, detalle, { headers });
  }

  put(detalle: DetallesFacturacion): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put(this.API_ENDPOINT + '/' + detalle.id_detalle, detalle, { headers });
  }

  delete(id_detalle: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.delete(this.API_ENDPOINT + '/' + id_detalle, { headers });
  }
}
