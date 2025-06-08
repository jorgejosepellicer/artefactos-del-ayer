import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../../../../../services/producto.service';
import { Producto } from '../../../../../../interfaces/producto';
import { Usuario } from '../../../../../../interfaces/usuario';
import { ProductComponent } from "../../../../../../components/product/product.component";
import { UsuarioService } from '../../../../../../services/usuario.service';
import { SharedService } from '../../../../../../services/shared.service';

@Component({
  selector: 'app-user-products',
  imports: [
    ProductComponent, 
  ],
  templateUrl: './user-products.component.html',
  styleUrl: './user-products.component.css'
})
export class UserProductsComponent implements OnInit{
  productoService: ProductoService = inject(ProductoService);
  sharedService: SharedService = inject(SharedService);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  usuarioService: UsuarioService = inject(UsuarioService);
  router: Router = inject(Router);

  usuario!: Usuario;

  id: number = this.activatedRoute.snapshot.params['id'];
  listaProductos: Producto[] = [];
  addProduct: boolean = false;

  ngOnInit() {
    //Si no hay this.id quiere decir que estamos accediento al componente desde profile
    if(!this.id) {
      this.usuario = this.sharedService.getLoggedUser()!;

      this.productoService.getActiveProductsByUserId(this.usuario.id_usuario).subscribe({
        next: (data) => this.listaProductos = data,
        complete: () => console.log('productos obtenidos')
      })      

    //Si hay this.id, significa que estamos accediendo desde el panel de administrador
    } else {
      this.usuarioService.getById(this.id).subscribe({
        next: (data) => {
          if(data) {
            this.usuario = data;
  
            this.productoService.getByUserId(this.usuario.id_usuario).subscribe({
              next: (data) => this.listaProductos = data,
              complete: () => console.log('productos obtenidos')
            })      
          }
        },
        error: (err) => console.error(err)
      })
  
    }
  }
}
