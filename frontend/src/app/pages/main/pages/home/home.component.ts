import { Component, inject, OnInit } from '@angular/core';
import { SearchBarComponent } from '../../../../components/search-bar/search-bar.component';
import { ProductoService } from '../../../../services/producto.service';
import { Producto } from '../../../../interfaces/producto';
import { ProductComponent } from "../../../../components/product/product.component";
import { SelectedCategoryComponent } from "../../../../components/selected-category/selected-category.component";
import { SubcategoriaService } from '../../../../services/subcategoria.service';
import { Subcategoria } from '../../../../interfaces/subcategoria';
import { SharedService } from '../../../../services/shared.service';
import { UsuarioService } from '../../../../services/usuario.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SearchBarComponent,
    ProductComponent,
    SelectedCategoryComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  productoService = inject(ProductoService);
  subcategoriaService = inject(SubcategoriaService);
  sharedService: SharedService = inject(SharedService);
  usuarioService: UsuarioService = inject(UsuarioService);

  productsList: Producto[] = [];
  filteredProductsList: Producto[] = [];
  selectedSubcategory: Subcategoria | null = null;

  ngOnInit(): void {
    // 1. Obtener productos
    if (this.usuarioService.isAdmin()) {
      this.productoService.getAll().subscribe({
        next: (data) => {
          this.productsList = data;
          this.filteredProductsList = data;

          // 2. Aplicar filtro inicial si hay subcategoría en localStorage
          const stored = this.subcategoriaService.getSubcategoria();
          if (stored) {
            this.selectedSubcategory = stored;
            this.filtrarPorSubcategoria(stored);
          }
        }
      });
    } else {
      this.productoService.getHomeProducts(this.sharedService.getLoggedUser()!.id_usuario).subscribe({
        next: (data) => {
          this.productsList = data;
          this.filteredProductsList = data;

          // 2. Aplicar filtro inicial si hay subcategoría en localStorage
          const stored = this.subcategoriaService.getSubcategoria();
          if (stored) {
            this.selectedSubcategory = stored;
            this.filtrarPorSubcategoria(stored);
          }
        }
      });
    }

    // 3. Escuchar cambios en la subcategoría
    this.subcategoriaService.subcategoria$.subscribe((subcategoria) => {
      this.selectedSubcategory = subcategoria;
      if (subcategoria) {
        this.filtrarPorSubcategoria(subcategoria);
      } else {
        // Si no hay subcategoría, mostrar todos
        this.filteredProductsList = this.productsList;
      }
    });
  }

  filterProducts(text: string): void {
    const searchText = text.toLowerCase().trim();
    this.filteredProductsList = this.productsList.filter(p =>
      p.nombre.toLowerCase().includes(searchText)
    );
  }

  filtrarPorSubcategoria(sub: Subcategoria): void {
    this.filteredProductsList = this.productsList.filter(p =>
      p.id_subcategoria === sub.id_subcategoria
    );
  }

  // Método para limpiar filtro si quieres implementarlo (opcional)
  limpiarFiltro() {
    this.subcategoriaService.clearSubcategoria();
  }
}
