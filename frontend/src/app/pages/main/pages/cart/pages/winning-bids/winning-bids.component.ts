import { Component, inject, OnInit } from '@angular/core';
import { Usuario } from '../../../../../../interfaces/usuario';
import { Producto } from '../../../../../../interfaces/producto';
import { ProductoService } from '../../../../../../services/producto.service';
import { PujaService } from '../../../../../../services/puja.service';
import { ProductComponent } from "../../../../../../components/product/product.component";
import { SharedService } from '../../../../../../services/shared.service';

@Component({
  selector: 'app-winning-bids',
  standalone: true,
  imports: [
    ProductComponent,
  ],
  templateUrl: './winning-bids.component.html',
  styleUrl: './winning-bids.component.css'
})
export class WinningBidsComponent implements OnInit {

  productoService: ProductoService = inject(ProductoService);
  pujaService: PujaService = inject(PujaService);
  sharedService: SharedService = inject(SharedService);
  

  user!: Usuario | null;
  arrayProductosGanados!: Producto[];

  ngOnInit() {
    this.user = this.sharedService.getLoggedUser();
    if (this.user) {
      this.productoService.getWinningProducts(this.user.id_usuario).subscribe({
        next: (productosGanados) => {
          this.arrayProductosGanados = productosGanados;
          console.log('Productos ganados:', this.arrayProductosGanados);
        },
        error: (error) => {
          console.error('Error cargando productos ganados:', error);
        }
      });
    }
  }
}
