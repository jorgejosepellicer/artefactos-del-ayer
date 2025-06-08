import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Imagen } from '../interfaces/imagen';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {
  API_ENDPOINT = environment.apiUrl + 'imagenes';
  UPLOAD_ENDPOINT = 'http://localhost:3000/upload'; // Cambia si tu servidor está en otro host/puerto

  constructor(private httpClient: HttpClient) {}

  getByProductId(productId: number): Observable<Imagen[]> {
    return this.httpClient.get<any>(`${this.API_ENDPOINT}?filter=id_producto,eq,${productId}`).pipe(
      map(data =>
        data.imagenes.records.map((record: any[]) => ({
          id_imagen: record[0],
          url: record[1],
          id_producto: record[2]
        } as Imagen))
      )
    );
  }

  put(imagen: Imagen) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put(this.API_ENDPOINT + '/' + imagen.id_imagen, imagen, { headers });
  }

  post(imagen: Imagen) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.API_ENDPOINT, imagen, { headers });
  }

  /**
   * Nueva función para subir imagen física al servidor
   * @param formData Debe incluir 'image' (archivo) y 'id_producto'
   */
  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.httpClient.post<{ imageUrl: string }>(this.UPLOAD_ENDPOINT, formData);
  }
    
  // Ya no es necesario si no vas a usar Base64
  // Puedes eliminarlo si no haces previsualización
  /*
  async convertirABase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
  */
}
