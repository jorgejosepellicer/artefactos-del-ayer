import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Producto } from '../../interfaces/producto';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CloseButtonComponent } from "../buttons/close-button/close-button.component";

@Component({
  selector: 'app-modal-payment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CloseButtonComponent
  ],
  templateUrl: './modal-payment.component.html',
  styleUrl: './modal-payment.component.css'
})
export class ModalPaymentComponent {
  @Input() product!: Producto | undefined;
  @Input() actualPrice$!: Observable<number>;

  @Output() closeModalPayment = new EventEmitter<boolean>;
  @Output() confirm = new EventEmitter<number>;

  montoPuja: number = 0;

  mensajeError: string = '';

  enviarPuja() {
    this.actualPrice$.subscribe((precioActual) => {
      if (this.montoPuja <= precioActual) {
        this.mensajeError = 'La puja debe ser mayor al precio actual.';
        return;
      }

      // Si pasa la validación
      this.mensajeError = '';
      this.confirm.emit(this.montoPuja)
    });
  }

  closeModal() {
    this.closeModalPayment.emit(false);
  }
}
