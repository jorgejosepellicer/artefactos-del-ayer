import { Component, Input } from '@angular/core';
import { CloseButtonComponent } from "../buttons/close-button/close-button.component";

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CloseButtonComponent],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.css'
})
export class ErrorMessageComponent {
  @Input() text!: string;
  visible: boolean = true;

  close() {
    this.visible = false;
  }
}
