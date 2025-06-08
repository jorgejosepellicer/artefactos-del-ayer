import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../interfaces/usuario';

export interface ModalData {
  type: string;
  show: boolean;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  // --- Common Modal ---
  commonModalSubject = new BehaviorSubject<ModalData>({
    type: '',
    show: false,
    text: ''
  });
  commonModal$ = this.commonModalSubject.asObservable();

  // --- Payment Modal ---
  paymentModalSubject = new BehaviorSubject<ModalData>({
    type: '',
    show: false,
    text: ''
  });
  paymentModal$ = this.paymentModalSubject.asObservable();

  // --- Actualizar modal común ---
  updateCommonModal(type: string, show: boolean) {
    const text = this.getCommonModalText(type);
    this.commonModalSubject.next({ type, show, text });
  }

  // --- Actualizar modal de pago ---
  updatePaymentModal(type: string, show: boolean) {
    const text = this.getPaymentModalText(type);
    this.paymentModalSubject.next({ type, show, text });
  }

  // --- Texto dinámico para common modal ---
  private getCommonModalText(type: string): string {
    switch (type) {
      case 'deleteBid':
        return '¿Estás seguro de que deseas eliminar la puja?';
      case 'deleteProduct':
        return '¿Estás seguro de que deseas eliminar este producto?';
      case 'deleteUser':
        return '¿Estás seguro de que deseas eliminar este usuario?';
      default:
        return '';
    }
  }

  // --- Texto dinámico para payment modal ---
  private getPaymentModalText(type: string): string {
    switch (type) {
      case 'addBid':
        return '¿Quieres realizar una nueva puja?';
      case 'editBid':
        return '¿Quieres modificar tu puja?';
      default:
        return '';
    }
  }

  // --- Obtener usuario logueado ---
  getLoggedUser(): Usuario | null {
    const userData = localStorage.getItem('usuario');
    if (userData) {
      try {
        return JSON.parse(userData) as Usuario;
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        return null;
      }
    }
    return null;
  }

  // --- Guardar usuario logueado ---
  setLoggedUser(user: Usuario): void {
    try {
      const userData = JSON.stringify(user);
      localStorage.setItem('usuario', userData);
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }

}
