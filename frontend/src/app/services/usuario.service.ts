import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../interfaces/usuario';
import { CookieService } from "ngx-cookie-service";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environment';
import { Producto } from '../interfaces/producto';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  sharedService: SharedService = inject(SharedService);

  constructor(private httpClient: HttpClient, private cookies: CookieService) { }
  API_ENDPOINT = environment.apiUrl + 'usuarios';

  getAll(): Observable<Usuario[]> {
    return this.httpClient.get<any>(this.API_ENDPOINT).pipe(
      map(data => {
        if (!data.usuarios || !data.usuarios.records) {
          return [];
        }
  
        return data.usuarios.records.map((record: any[]) => ({
          id_usuario: record[0],
          nombre: record[1],
          apellido1: record[2],
          apellido2: record[3],
          nickname: record[4],
          email: record[5],
          telefono: record[6],
          password: record[7],
          id_rol: record[8],
        } as Usuario));
      })
    );
  }

  getById(id: number): Observable<Usuario | null> {
    return this.httpClient.get<any>(`${this.API_ENDPOINT}/${id}`).pipe(
      map(data => {
        if (!data || !data.id_usuario) {
          return null;
        }
        
        return {
          id_usuario: data.id_usuario,
          nombre: data.nombre,
          apellido1: data.apellido1,
          apellido2: data.apellido2,
          nickname: data.nickname,
          email: data.email,
          telefono: data.telefono,
          password: data.password,
          id_rol: data.id_rol,
        } as Usuario;
      })
    );
  }  

  getByEmail(email: string): Observable<Usuario | null> {
    return this.httpClient.get<any>(`${this.API_ENDPOINT}?filter=email,eq,${email}`).pipe(
      map(data => 
        data.usuarios.records.length > 0 ? { 
          id_usuario: data.usuarios.records[0][0],
          nombre: data.usuarios.records[0][1],
          apellido1: data.usuarios.records[0][2],
          apellido2: data.usuarios.records[0][3],
          nickname: data.usuarios.records[0][4],
          email: data.usuarios.records[0][5],
          telefono: data.usuarios.records[0][6],
          password: data.usuarios.records[0][7],
          id_rol: data.usuarios.records[0][8],
        } as Usuario : null
      )
    );
  }
  
  post(usuario: Usuario) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.API_ENDPOINT, usuario, { headers: headers });
  }

  put(usuario: Usuario) {
    console.log(usuario)
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put(this.API_ENDPOINT + '/' + usuario.id_usuario, usuario, { headers: headers });
  }

  delete(id: number) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.delete(`${this.API_ENDPOINT}/${id}`, { headers });
  }  

  setToken(token: string) {
    this.cookies.set("token", token);
  }
  getToken() {
    return this.cookies.get("token");
  }

  isOwner(product: Producto): boolean {
    const user = this.sharedService.getLoggedUser();
    return user ? user.id_usuario === product.id_usuario : false;
  }

  isAdmin(): boolean {
    const user = this.sharedService.getLoggedUser();
    return user ? user.id_rol === 1 : false;
  }
  
}
