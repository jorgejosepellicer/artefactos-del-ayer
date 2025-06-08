import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [
    FormsModule
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  @Input() placeholder: string = 'Buscar...';
  @Output() buscar = new EventEmitter<string>();

  query: string = '';

  onSearch() {
    this.buscar.emit(this.query); 
  }

}
