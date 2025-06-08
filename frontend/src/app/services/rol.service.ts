import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Rol } from '../interfaces/rol';
import { environment } from '../environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  API_ENDPOINT = environment.apiUrl + 'roles';

  constructor(private httpClient: HttpClient) { }

  getByUserId(userId: number): Observable<Rol | null> { //Devuelve la puja pasada como propiedad.
    return this.httpClient.get<any>(`${this.API_ENDPOINT}?filter=id_usuario,eq,${userId}`).pipe(
      map(data =>
        data != null ? {
          id_rol: data.id_rol,
          nombre: data.nombre,
          descripcion: data.descripcion
        } as Rol : null
      )
    );
  }

  put(rol: Rol) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put(this.API_ENDPOINT + '/' + rol.id_rol, rol, { headers: headers });
  }
}
