import { Component, inject, OnInit } from '@angular/core';
import { Usuario } from '../../../../../../interfaces/usuario';
import { Producto } from '../../../../../../interfaces/producto';
import { ProductoService } from '../../../../../../services/producto.service';
import { PujaService } from '../../../../../../services/puja.service';
import { ProductComponent } from "../../../../../../components/product/product.component";
import { SharedService } from '../../../../../../services/shared.service';

@Component({
  selector: 'app-losing-bids',
  imports: [
    ProductComponent,
  ],
  templateUrl: './losing-bids.component.html',
  styleUrl: './losing-bids.component.css'
})
export class LosingBidsComponent implements OnInit {

  private productoService = inject(ProductoService);
  private pujaService = inject(PujaService);
  private sharedService = inject(SharedService);

  user!: Usuario | null;
  arrayProductosPerdidos!: Producto[];

  ngOnInit() {
    this.user = this.sharedService.getLoggedUser();
    if (this.user) {
      this.productoService.getLosingProducts(this.user.id_usuario).subscribe({
        next: (productos) => {
          this.arrayProductosPerdidos = productos;
          console.log('Productos perdiendo:', productos);
        },
        error: (err) => {
          console.error('Error:', err);
        }
      });
    }
  }
}
