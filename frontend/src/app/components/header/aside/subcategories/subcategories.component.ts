import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subcategoria } from '../../../../interfaces/subcategoria';

@Component({
  selector: 'app-subcategories',
  imports: [],
  templateUrl: './subcategories.component.html',
  styleUrl: './subcategories.component.css'
})
export class SubcategoriesComponent {
  @Input() subcategoria!: Subcategoria;

  @Output() selectedSubcategoria = new EventEmitter<Subcategoria>;

  onSubcategoriaClick() {
    this.selectedSubcategoria.emit(this.subcategoria);
  }
}
