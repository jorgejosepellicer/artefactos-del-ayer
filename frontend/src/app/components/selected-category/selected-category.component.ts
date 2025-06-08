import { Component, inject, Input } from '@angular/core';
import { CloseButtonComponent } from "../buttons/close-button/close-button.component";
import { SubcategoriaService } from '../../services/subcategoria.service';

@Component({
  selector: 'app-selected-category',
  imports: [CloseButtonComponent],
  templateUrl: './selected-category.component.html',
  styleUrl: './selected-category.component.css'
})
export class SelectedCategoryComponent {
  subcategoriaService: SubcategoriaService = inject(SubcategoriaService);
  @Input() categoryName!: string;

  close() {
    this.subcategoriaService.clearSubcategoria();
  }
}
