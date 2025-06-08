import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-close-button',
  imports: [],
  templateUrl: './close-button.component.html',
  styleUrl: './close-button.component.css'
})
export class CloseButtonComponent {
  @Output() click = new EventEmitter;

  clickButton() {
    this.click.emit();
  }
}
