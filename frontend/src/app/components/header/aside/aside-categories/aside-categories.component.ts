import { Component, inject, OnInit } from '@angular/core';
import { Categoria } from '../../../../interfaces/categoria';
import { CategoriaService } from '../../../../services/categoria.service';
import { CategoriesComponent } from '../categories/categories.component';
import { ViewerService } from '../../../../services/viewer.service';
import { Subcategoria } from '../../../../interfaces/subcategoria';
import { SubcategoriaService } from '../../../../services/subcategoria.service';
import { CloseButtonComponent } from "../../../buttons/close-button/close-button.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-aside-categories',
  standalone: true,
  imports: [
    CategoriesComponent,
    CloseButtonComponent
],
  templateUrl: './aside-categories.component.html',
  styleUrl: './aside-categories.component.css'
})
export class AsideCategoriesComponent implements OnInit {
  categoriaService: CategoriaService = inject(CategoriaService);
  subcategoriaService: SubcategoriaService = inject(SubcategoriaService);
  viewerService: ViewerService = inject(ViewerService);
  router: Router = inject(Router);

  categorias: Categoria[] = [];
  categoriasSeleccionadas: number[] = [];
  visible: boolean = false;

  ngOnInit(): void {
    this.viewerService.state$.subscribe(state => {
      this.visible = state['categorias'] ?? false;
    });
        
    this.categoriaService.getAll().subscribe({
      next: (data) => this.categorias = data,
    });
  }

  toggleSelectedCategories(idCategory: number) {
    const index = this.categoriasSeleccionadas.indexOf(idCategory);
    
    if (index !== -1) {
      this.categoriasSeleccionadas.splice(index, 1);
    } else {
      this.categoriasSeleccionadas.push(idCategory);
    }
  }

  closeCategories() {
    this.viewerService.hide("categorias");
    document.body.classList.remove('no-scroll');
  }

  onSubcategoriaClick(sub: Subcategoria) {
    this.closeCategories();
    this.subcategoriaService.setSubcategoria(sub);
    this.router.navigate(['main/home'])
  }
}
