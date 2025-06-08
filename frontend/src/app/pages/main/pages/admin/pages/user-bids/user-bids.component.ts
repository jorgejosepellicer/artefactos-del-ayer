import { Component, inject } from '@angular/core';
import { ProductoService } from '../../../../../../services/producto.service';
import { SharedService } from '../../../../../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../../../../services/usuario.service';
import { Usuario } from '../../../../../../interfaces/usuario';
import { Producto } from '../../../../../../interfaces/producto';
import { Puja } from '../../../../../../interfaces/puja';
import { PujaService } from '../../../../../../services/puja.service';
import { BidTargetComponent } from "../../../../../../components/bid-target/bid-target.component";
import { ModalComponent } from "../../../../../../components/modal/modal.component";

@Component({
  selector: 'app-user-bids',
  imports: [BidTargetComponent, ModalComponent],
  templateUrl: './user-bids.component.html',
  styleUrl: './user-bids.component.css'
})
export class UserBidsComponent {
  productoService: ProductoService = inject(ProductoService);
  sharedService: SharedService = inject(SharedService);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  usuarioService: UsuarioService = inject(UsuarioService);
  pujaService: PujaService = inject(PujaService);
  router: Router = inject(Router);

  usuario!: Usuario;
  product!: Producto;

  id: number = this.activatedRoute.snapshot.params['id'];
  listaPujas: Puja[] = [];

  ngOnInit() {
    this.usuarioService.getById(this.id).subscribe({
      next: (data) => {
        if (data) {
          this.usuario = data;

          this.pujaService.getByUserId(this.usuario.id_usuario).subscribe({
            next: (data) => {
              if(data) {
                this.listaPujas = data;
              }
            }
          })
        }
      },
      error: (err) => console.error(err)
    })
  }

  handleClickDelete(event: any) {
    this.product = event.product;
    this.openCommonModal('deleteBid');
  }

  acceptModal(): void {
    this.deleteBid();
    this.sharedService.updateCommonModal('', false);
  }

  deleteBid(): void {
    if (!this.usuario || !this.product) {
      alert('Ha habido un error');
      return;
    }

    this.pujaService.getUserBidOfProduct(this.usuario.id_usuario, this.product.id_producto).subscribe({
      next: (puja) => {
        if (puja) {
          this.pujaService.delete(puja).subscribe({
            complete: () => {
              alert('Puja eliminada');
              this.sharedService.updateCommonModal('', false);
              window.location.reload();
            },
            error: (err) => console.error(err)
          });
        }
      },
      error: (err) => console.error(err)
    });
  }

  openCommonModal(type: 'deleteBid' | 'deleteProduct'): void {
    this.sharedService.updateCommonModal(type, true);
  }
}
