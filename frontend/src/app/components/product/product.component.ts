import { Component, inject, Input, OnInit } from '@angular/core';
import { Producto } from '../../interfaces/producto';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { Usuario } from '../../interfaces/usuario';
import { PujaService } from '../../services/puja.service';
import { Puja } from '../../interfaces/puja';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Observable } from 'rxjs';
import { ImagenService } from '../../services/imagen.service';
import { Imagen } from '../../interfaces/imagen';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  @Input() producto!: Producto;

  router: Router = inject(Router);
  sharedService: SharedService = inject(SharedService);
  pujaService: PujaService = inject(PujaService);
  productoService: ProductoService = inject(ProductoService);
  imagenService: ImagenService = inject(ImagenService);
  sanitizer: DomSanitizer = inject(DomSanitizer);

  user!: Usuario | null;
  userBid: Puja | undefined;
  maxBid: Puja | undefined;
  userHasBid: boolean = false;
  actualPrice$!: Observable<number>;
  productImages: Imagen[] = [];
  safeImageUrl!: SafeStyle;
  
  ngOnInit(): void {
    this.user = this.sharedService.getLoggedUser();
    this.actualPrice$ = this.productoService.getActualPrice(this.producto);
    
    this.imagenService.getByProductId(this.producto.id_producto).subscribe({
      next: (data) => {
        this.productImages = data;
    
        if (this.productImages.length > 0) {
          this.safeImageUrl = this.sanitizer.bypassSecurityTrustStyle(`url('${this.productImages[0].url}')`);
        }
      }
    });
    
    this.pujaService.getByProductId(this.producto.id_producto).subscribe(pujas => {
      if (pujas.length > 0) {
        this.maxBid = pujas.reduce((max, p) => p.precio > max.precio ? p : max, pujas[0]);
      }

      this.userHasBid = pujas.some(p => p.id_usuario === this.user?.id_usuario);

      if (this.userHasBid) {
        this.userBid = pujas.find(p => p.id_usuario === this.user?.id_usuario);
      }
    });
  }
}
