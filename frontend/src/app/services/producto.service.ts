import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from "ngx-cookie-service";
import { forkJoin, Observable } from 'rxjs';
import { flatMap, map, switchMap } from 'rxjs/operators';
import { Producto } from '../interfaces/producto';
import { environment } from '../environment';
import { PujaService } from './puja.service';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  pujaService: PujaService = inject(PujaService);

  constructor(private httpClient: HttpClient, private cookies: CookieService) { }

  API_ENDPOINT = environment.apiUrl + 'productos/';

  getAll(): Observable<Producto[]> { //Devuelve todos los productos.
    return this.httpClient.get<any>(this.API_ENDPOINT).pipe(
      map(data =>
        data.productos.records.map((record: any[]) => ({
          id_producto: record[0],
          nombre: record[1],
          descripcion: record[2],
          precio_inicial: record[3],
          fecha_inicio: record[4],
          fecha_fin: record[5],
          valoracion: record[6],
          id_usuario: record[7],
          id_subcategoria: record[8],
          finalizado: record[9],
          id_usuario_ganador: record[10],
        } as Producto))
      )
    );
  }

  getHomeProducts(userId: number): Observable<Producto[]> { //Devuelve los productos que se mostrarán en el home (no sean tuyos, no estés pujando por ellos y no hayan finalizado).
    const urlProductos = `${this.API_ENDPOINT}?filter[]=id_usuario,neq,${userId}&filter[]=finalizado,eq,0`;
    const urlPujas = `${environment.apiUrl}pujas?filter=id_usuario,eq,${userId}`;

    return this.httpClient.get<any>(urlProductos).pipe(
      map(data =>
        data.productos.records.map((record: any[]): Producto => ({
          id_producto: record[0],
          nombre: record[1],
          descripcion: record[2],
          precio_inicial: record[3],
          fecha_inicio: record[4],
          fecha_fin: record[5],
          valoracion: record[6],
          id_usuario: record[7],
          id_subcategoria: record[8],
          finalizado: record[9],
          id_usuario_ganador: record[10],
        }))
      ),
      // Filtramos luego de obtener las pujas
      map(productos => {
        return this.httpClient.get<any>(urlPujas).pipe(
          map(pujasData => {
            const idProductosPujados = new Set(
              (pujasData.pujas?.records || []).map((r: any[]) => r[0]) // r[0] es id_producto
            );

            // Excluir productos ya pujados por este usuario
            return productos.filter((producto: Producto) => !idProductosPujados.has(producto.id_producto));

          })
        );
      }),
      // Aplanamos el observable anidado
      flatMap(obs => obs)
    );
  }


  getById(id: number): Observable<Producto> { //Devuelve el producto con la id pasada como parámetro.
    return this.httpClient.get<any>(this.API_ENDPOINT + id).pipe(
      map(data => {
        if (data == null) {
          throw new Error('Producto no encontrado');
        }
        return {
          id_producto: data.id_producto,
          nombre: data.nombre,
          descripcion: data.descripcion,
          precio_inicial: data.precio_inicial,
          fecha_inicio: data.fecha_inicio,
          fecha_fin: data.fecha_fin,
          valoracion: data.valoracion,
          id_usuario: data.id_usuario,
          id_subcategoria: data.id_subcategoria,
          finalizado: data.finalizado,
          id_usuario_ganador: data.id_usuario_ganador
        } as Producto;
      })
    );
  }

  getByUserId(userId: number): Observable<Producto[]> { //Dvuelve todos los productos pertenecientes al usuario pasado como parámetro
    return this.httpClient.get<any>(`${this.API_ENDPOINT}?filter=id_usuario,eq,${userId}`).pipe(
      map(data =>
        data.productos.records.map((record: any[]) => ({
          id_producto: record[0],
          nombre: record[1],
          descripcion: record[2],
          precio_inicial: record[3],
          fecha_inicio: record[4],
          fecha_fin: record[5],
          valoracion: record[6],
          id_usuario: record[7],
          id_subcategoria: record[8],
          finalizado: record[9],
          id_usuario_ganador: record[10],
        } as Producto))
      )
    );
  }

  getActiveProductsByUserId(userId: number): Observable<Producto[]> { //Devuelve los productos del usuario pasado como paámetro que no hayan finalizado.
    return this.getByUserId(userId).pipe(
      map(productos => productos.filter(p => !p.finalizado))
    );
  }
  

  getActualPrice(product: Producto): Observable<number> { //Si hay pujas por el producto, devuelve el monto más alto. Si no, devuelve el precio inicial.
    const PUJAS_ENDPOINT = environment.apiUrl + 'pujas';
    const url = `${PUJAS_ENDPOINT}?filter=id_producto,eq,${product.id_producto}`;

    return this.httpClient.get<any>(url).pipe(
      map(data => {
        const pujas = data.pujas?.records || [];

        if (pujas.length === 0) {
          return product.precio_inicial;
        }

        const montos = pujas.map((record: any[]) => record[1]);

        const pujaMaxima = Math.max(...montos);
        return pujaMaxima;
      })
    );
  }

  getLosingProducts(userId: number): Observable<Producto[]> { //Devuelve los productos que no han finalizado cuya puja vas perdiendo.
    return this.pujaService.getByUserId(userId).pipe(
      switchMap(pujasUsuario => {
        const productos$ = pujasUsuario.map(puja => this.getById(puja.id_producto));
        return forkJoin(productos$);
      }),
      switchMap(productos => {
        const evaluaciones$ = productos.map(producto =>
          this.pujaService.getByProductId(producto.id_producto).pipe(
            map(pujas => {
              if (producto.finalizado) return null; // ya finalizó
  
              const pujaMasAlta = pujas.reduce((max, puja) =>
                puja.precio > max.precio ? puja : max, pujas[0]);
  
              return pujaMasAlta.id_usuario !== userId ? producto : null;
            })
          )
        );
        return forkJoin(evaluaciones$);
      }),
      map(productosFiltrados => productosFiltrados.filter((p): p is Producto => p !== null))
    );
  }

  getWinningProducts(userId: number): Observable<Producto[]> { //Devuelve los productos que no han finalizado cuya puja vas ganando.
    return this.pujaService.getByUserId(userId).pipe(
      switchMap(pujasUsuario => {
        const productos$ = pujasUsuario.map(puja => this.getById(puja.id_producto));
        return forkJoin(productos$);
      }),
      switchMap(productos => {
        const evaluaciones$ = productos.map(producto =>
          this.pujaService.getByProductId(producto.id_producto).pipe(
            map(pujas => {
              if (producto.finalizado) return null;
  
              const pujaMasAlta = pujas.reduce(
                (max, puja) => puja.precio > max.precio ? puja : max,
                pujas[0]
              );
  
              return pujaMasAlta.id_usuario === userId ? producto : null;
            })
          )
        );
        return forkJoin(evaluaciones$);
      }),
      map(productosFiltrados => productosFiltrados.filter((p): p is Producto => p !== null))
    );
  }
  
  

  post(producto: Producto) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.API_ENDPOINT, producto, { headers: headers });
  }

  put(producto: Producto) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put(this.API_ENDPOINT + '/' + producto.id_producto, producto, { headers: headers });
  }

  delete(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.delete(`${this.API_ENDPOINT}${id}`, { headers });
  }

  setToken(token: string) {
    this.cookies.set("token", token);
  }
  getToken() {
    return this.cookies.get("token");
  }
}
