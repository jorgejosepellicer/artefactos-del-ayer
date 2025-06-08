import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Categoria } from '../../../../interfaces/categoria';
import { SubcategoriaService } from '../../../../services/subcategoria.service';
import { Subcategoria } from '../../../../interfaces/subcategoria';
import { SubcategoriesComponent } from "../subcategories/subcategories.component";

@Component({
  selector: 'app-categories',
  imports: [
    SubcategoriesComponent
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  subcategoriaService: SubcategoriaService = inject(SubcategoriaService);

  @Input() categoria!: Categoria;
  @Input() categoriasSeleccionadas!: number[];
  @Output() categoriaSeleccionada = new EventEmitter<number>;
  @Output() selectedSubcategoria = new EventEmitter<Subcategoria>;
  subcategorias: Subcategoria[] = [];

  ngOnInit(): void {
    this.subcategoriaService.getByIdCategory(this.categoria.id_categoria).subscribe({
      next: (data) => this.subcategorias = data,
    })
  }

  onCategoriaClick() {
    this.categoriaSeleccionada.emit(this.categoria.id_categoria);
  }

  onSubcategoriaClick(sub: Subcategoria) {
    this.selectedSubcategoria.emit(sub);
  }
}
