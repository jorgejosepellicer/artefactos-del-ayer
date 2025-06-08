import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../../services/producto.service';
import { Producto } from '../../../../interfaces/producto';
import { SharedService } from '../../../../services/shared.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { SubcategoriaService } from '../../../../services/subcategoria.service';
import { Subcategoria } from '../../../../interfaces/subcategoria';
import { ImagenService } from '../../../../services/imagen.service';
import { Imagen } from '../../../../interfaces/imagen';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  productoService: ProductoService = inject(ProductoService);
  sharedService: SharedService = inject(SharedService);
  usuarioService: UsuarioService = inject(UsuarioService);
  subcategoriaService: SubcategoriaService = inject(SubcategoriaService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);
  imagenService: ImagenService = inject(ImagenService);

  productForm!: FormGroup;
  isEditMode = false;
  productId!: number;
  product!: Producto;
  isValid = true;
  subcategories!: Subcategoria[];
  archivos: File[] = [];
  imagenPrevisualizada: string | null = null;
  imagenExistenteId: number | null = null;

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = this.productId > 0;

    this.subcategoriaService.getAll().subscribe({
      next: (data) => this.subcategories = data,
      error: (err) => console.error(err)
    });

    this.initForm();

    if (this.isEditMode) {
      this.productoService.getById(this.productId).subscribe({
        next: (producto) => {
          this.product = producto;
          if (this.usuarioService.isOwner(this.product) || this.usuarioService.isAdmin()) {
            const fechaFormateada = this.formatDateForInput(this.product.fecha_fin);
            this.productForm.patchValue({ ...producto, fecha_fin: fechaFormateada });

            // Obtener imagen existente
            this.imagenService.getByProductId(this.productId).subscribe({
              next: (imagenes) => {
                if (imagenes.length > 0) {
                  this.imagenPrevisualizada = imagenes[0].url;
                  this.imagenExistenteId = imagenes[0].id_imagen;
                }
              }
            });
          } else {
            this.isValid = false;
          }
        },
        error: () => this.isValid = false
      });
    }
  }

  initForm(): void {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      id_subcategoria: [0, Validators.required],
      id_usuario: this.sharedService.getLoggedUser()?.id_usuario
    });

    if (!this.isEditMode) {
      this.productForm.addControl('precio_inicial', this.fb.control(0, [Validators.required, Validators.min(0.01)]));
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const producto: Producto = {
      ...this.productForm.value,
      id_producto: this.isEditMode ? this.productId : 0,
      fecha_inicio: new Date().toISOString()
    };
            
    if (this.isEditMode) {
      this.productoService.put(producto).subscribe({
        complete: () => {
          if (this.archivos.length > 0) {
            this.subirYGuardarImagen(this.productId);
          } else {
            alert('Producto actualizado');
            this.router.navigate(['/main/home']);
          }
        },
        error: (err) => console.error(err)
      });
    } else {
      this.productoService.post(producto).subscribe({
        next: (data) => {
          const idProductoCreado = typeof data === 'number' ? data : 0;
          if (this.archivos.length > 0) {
            this.subirYGuardarImagen(idProductoCreado);
          } else {
            this.router.navigate(['/main/home']);
          }
        },
        error: (err) => console.error(err)
      });
    }
  }

  subirYGuardarImagen(idProducto: number): void {
    this.imagenService.uploadImage(this.archivos[0]).subscribe({
      next: (res) => {
        const imagen: Imagen = {
          id_imagen: this.imagenExistenteId ?? 0,
          url: res.imageUrl,
          id_producto: idProducto
        };

        const request$ = this.imagenExistenteId
          ? this.imagenService.put(imagen)
          : this.imagenService.post(imagen);

        request$.subscribe({
          complete: () => {
            alert(this.isEditMode ? 'Producto e imagen actualizados' : 'Producto e imagen creados');
            this.router.navigate(['/main/home']);
          },
          error: (err) => console.error('Error guardando imagen en BD:', err)
        });
      },
      error: (err) => console.error('Error al subir imagen:', err)
    });
  }

  private formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  capturarFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const archivo = input.files[0];
    this.archivos = [archivo];

    const reader = new FileReader();
    reader.onload = () => this.imagenPrevisualizada = reader.result as string;
    reader.readAsDataURL(archivo);
  }
}
