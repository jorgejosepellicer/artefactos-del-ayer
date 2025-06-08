import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CloseButtonComponent } from "../buttons/close-button/close-button.component";

@Component({
  selector: 'app-modal',
  imports: [CloseButtonComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() text!: string;
  @Output() clickCloseButton = new EventEmitter<boolean>;
  @Output() accept = new EventEmitter<boolean>;

  closeModal() {
    this.clickCloseButton.emit(false);
  }
  clickAccept() {
    this.accept.emit();
  }
}
