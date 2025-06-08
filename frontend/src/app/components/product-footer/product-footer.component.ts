import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable, of } from 'rxjs';

import { Producto } from '../../interfaces/producto';
import { Usuario } from '../../interfaces/usuario';
import { Puja } from '../../interfaces/puja';

import { SharedService } from '../../services/shared.service';
import { PujaService } from '../../services/puja.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-footer',
  standalone: true,
  templateUrl: './product-footer.component.html',
  styleUrls: ['./product-footer.component.css'],
  imports: [
    CommonModule,
  ],
})
export class ProductFooterComponent implements OnInit {
  router: Router = inject(Router);

  @Input() product!: Producto;
  @Input() actualPrice$!: Observable<number>;

  @Output() openPaymentModalEvent = new EventEmitter<'addBid' | 'editBid'>();
  @Output() openCommonModalEvent = new EventEmitter<'deleteProduct' | 'deleteBid'>();

  private sharedService = inject(SharedService);
  private pujaService = inject(PujaService);

  user: Usuario | null = null;
  isBidding$: Observable<boolean> = of(false);

  ngOnInit(): void {
    this.user = this.sharedService.getLoggedUser();

    if (this.user) {
      this.isBidding$ = this.pujaService.getByUserId(this.user.id_usuario).pipe(
        map((pujas: Puja[]) => pujas.some(p => p.id_producto === this.product.id_producto))
      );
    }
  }

  isOwner(): boolean {
    return this.user?.id_usuario === this.product.id_usuario;
  }

  isAdmin(): boolean {
    return this.user?.id_rol === 1;
  }

  openPaymentModal(type: 'addBid' | 'editBid'): void {
    this.openPaymentModalEvent.emit(type);
  }

  openDeleteModal(type: 'deleteProduct' | 'deleteBid'): void {
    this.openCommonModalEvent.emit(type);
  }

  handleEditProduct() {
    this.router.navigate(['/main/product-form', this.product.id_producto]);
  }
}
