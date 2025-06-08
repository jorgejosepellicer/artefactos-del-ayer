import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subcategoria } from '../interfaces/subcategoria';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriaService {
  API_ENDPOINT = environment.apiUrl + 'subcategorias';

  private subcategoriaSubject = new BehaviorSubject<Subcategoria | null>(this.getSubcategoria());
  subcategoria$ = this.subcategoriaSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Subcategoria[]> {
    return this.httpClient.get<any>(this.API_ENDPOINT).pipe(
      map(data =>
        data.subcategorias.records.length > 0
          ? data.subcategorias.records.map((val: any[]) => ({
            id_subcategoria: val[0],
            nombre: val[1],
            descripcion: val[2],
            id_categoria: val[3]
          } as Subcategoria))
          : []
      )
    );
  }

  getByIdCategory(idCategory: number): Observable<Subcategoria[]> {
    return this.httpClient.get<any>(`${this.API_ENDPOINT}?filter=id_categoria,eq,${idCategory}`).pipe(
      map(data =>
        data.subcategorias.records.length > 0
          ? data.subcategorias.records.map((val: any[]) => ({
            id_subcategoria: val[0],
            nombre: val[1],
            descripcion: val[2],
            id_categoria: val[3]
          } as Subcategoria))
          : []
      )
    );
  }

  put(subcategoria: Subcategoria) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put(this.API_ENDPOINT + '/' + subcategoria.id_categoria, subcategoria, { headers: headers });
  }

  setSubcategoria(sub: Subcategoria) {
    localStorage.setItem('subcategoria', JSON.stringify(sub));  // ✅ Serializar
    this.subcategoriaSubject.next(sub);
  }
  
  getSubcategoria(): Subcategoria | null {
    const data = localStorage.getItem('subcategoria');
    return data ? JSON.parse(data) as Subcategoria : null;
  }
  
  clearSubcategoria() {
    localStorage.removeItem('subcategoria');
    this.subcategoriaSubject.next(null);
  }

}
