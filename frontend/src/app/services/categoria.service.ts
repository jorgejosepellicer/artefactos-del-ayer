import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Categoria } from '../interfaces/categoria';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environment';
import { Subcategoria } from '../interfaces/subcategoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  API_ENDPOINT = environment.apiUrl + 'categorias';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Categoria[]> {
    return this.httpClient.get<any>(this.API_ENDPOINT).pipe(
      map(data =>
        data.categorias.records.length > 0
          ? data.categorias.records.map((val: any[]) => ({
              id_categoria: val[0],
              nombre: val[1],
              descripcion: val[2]
            } as Categoria))
          : []
      )
    );
  }

  put(categoria: Categoria) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put(
      `${this.API_ENDPOINT}/${categoria.id_categoria}`,
      categoria,
      { headers }
    );
  }
}
