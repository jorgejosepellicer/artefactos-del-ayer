import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Puja } from '../../interfaces/puja';
import { Producto } from '../../interfaces/producto';
import { ProductoService } from '../../services/producto.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-bid-target',
  imports: [],
  templateUrl: './bid-target.component.html',
  styleUrl: './bid-target.component.css'
})
export class BidTargetComponent implements OnInit {
  productoService: ProductoService = inject(ProductoService);

  @Input() puja!: Puja;
  @Output() clickDelete = new EventEmitter;

  product!: Producto;

  ngOnInit(): void {
    this.productoService.getById(this.puja.id_producto).subscribe({
      next: (data) => {
        this.product = data;
      },
      error: (err) => console.error(err)
    })
  }

  onDeleteClick() {
    this.clickDelete.emit({puja: this.puja, product: this.product});
  }
}
