import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../../../services/producto.service';
import { Producto } from '../../../../interfaces/producto';
import { PujaService } from '../../../../services/puja.service';
import { Observable } from 'rxjs';
import { ProductFooterComponent } from "../../../../components/product-footer/product-footer.component";
import { CommonModule } from '@angular/common';
import { ModalPaymentComponent } from "../../../../components/modal-payment/modal-payment.component";
import { ModalComponent } from "../../../../components/modal/modal.component";
import { Puja } from '../../../../interfaces/puja';
import { SharedService } from '../../../../services/shared.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { Usuario } from '../../../../interfaces/usuario';
import { ImagenService } from '../../../../services/imagen.service';
import { Imagen } from '../../../../interfaces/imagen';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    ProductFooterComponent,
    ModalPaymentComponent,
    ModalComponent
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  productoService = inject(ProductoService);
  pujaService = inject(PujaService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  sharedService = inject(SharedService);
  usuarioService = inject(UsuarioService);
  imagenService: ImagenService = inject(ImagenService);
  sanitizer: DomSanitizer = inject(DomSanitizer);

  actualPrice$!: Observable<number>;
  commonModal$ = this.sharedService.commonModal$;
  paymentModal$ = this.sharedService.paymentModal$;
  product!: Producto;
  productImages: Imagen[] = [];
  safeImageUrl!: SafeStyle;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);

    this.productoService.getById(id).subscribe({
      next: (producto) => {
        this.product = producto;
        this.actualPrice$ = this.productoService.getActualPrice(this.product);

        //Obtener imagen
        this.imagenService.getByProductId(this.product.id_producto).subscribe({
          next: (data) => {
            this.productImages = data;
    
            if (this.productImages.length > 0) {
              this.safeImageUrl = this.sanitizer.bypassSecurityTrustStyle(`url('${this.productImages[0].url}')`);
            }
            console.log(this.safeImageUrl)
          }
        });    
      },
      error: (err) => {
        console.error('Error al obtener producto:', err);
      }
    });
  }

  acceptModal(): void {
    const type = this.sharedService.commonModalSubject.getValue().type;

    if (type === 'deleteProduct') {
      this.deleteProduct();
    } else if (type === 'deleteBid') {
      this.deleteBid();
    }

    this.sharedService.updateCommonModal('', false);
  }

  confirmPayment(amount: number): void {
    const user = this.sharedService.getLoggedUser();
    const type = this.sharedService.paymentModalSubject.getValue().type;

    if (!this.isValid(user, this.product, amount)) {
      alert('Ha habido un error.');
      return;
    }

    if (type === 'addBid') {
      this.addBid(user!, amount);
    } else if (type === 'editBid') {
      this.editBid(user!, amount);
    }
  }

  deleteBid(): void {
    const user = this.sharedService.getLoggedUser();
    if (!user || !this.product) {
      alert('Ha habido un error');
      return;
    }

    this.pujaService.getUserBidOfProduct(user.id_usuario, this.product.id_producto).subscribe({
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

  deleteProduct(): void {
    if (!this.product) {
      alert('Ha habido un error');
      return;
    }

    this.productoService.delete(this.product.id_producto).subscribe({
      complete: () => {
        alert('Producto eliminado');
        this.router.navigate(['/main/home']);
      },
      error: (err) => console.error(err)
    });
  }

  openCommonModal(type: 'deleteBid' | 'deleteProduct'): void {
    this.sharedService.updateCommonModal(type, true);
  }

  openPaymentModal(type: 'addBid' | 'editBid'): void {
    this.sharedService.updatePaymentModal(type, true);
  }

  addBid(user: Usuario, amount: number): void {
    const newBid: Puja = {
      id_puja: 0,
      precio: amount,
      id_usuario: user.id_usuario,
      id_producto: this.product!.id_producto
    };

    this.pujaService.post(newBid).subscribe({
      complete: () => this.onBidSuccess('Puja realizada'),
      error: (err) => console.error(err)
    });
  }

  editBid(user: Usuario, amount: number): void {
    this.pujaService.getUserBidOfProduct(user.id_usuario, this.product!.id_producto).subscribe({
      next: (userBid) => {
        if (userBid) {
          userBid.precio = amount;
          this.pujaService.put(userBid).subscribe({
            complete: () => this.onBidSuccess('Puja editada'),
            error: (err) => console.error(err)
          });
        }
      },
      error: (err) => console.error(err)
    });
  }

  isValid(user: Usuario | null, product: Producto | null, amount: number): boolean {
    return !!(user && product && amount);
  }

  onBidSuccess(message: string): void {
    alert(message);
    this.sharedService.updatePaymentModal('', false);
    window.location.reload();
  }
}
