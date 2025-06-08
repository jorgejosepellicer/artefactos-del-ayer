import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../../../../services/usuario.service';
import { DetallesFacturacionService } from '../../../../../../services/detalles-facturacion.service';
import { Usuario } from '../../../../../../interfaces/usuario';
import { DetallesFacturacion } from '../../../../../../interfaces/detalles-facturacion';
import { SharedService } from '../../../../../../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  fb: FormBuilder = inject(FormBuilder);
  usuarioService: UsuarioService = inject(UsuarioService);
  sharedService: SharedService = inject(SharedService);
  facturacionService: DetallesFacturacionService = inject(DetallesFacturacionService);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router)

  userForm!: FormGroup;
  facturacionForm?: FormGroup;
  usuario!: Usuario;
  detalles!: DetallesFacturacion;

  id: number | null = null;

  ngOnInit(): void {
    const routeId = this.activatedRoute.snapshot.params['id'];
    this.id = routeId ? +routeId : null;

    if (this.id) {
      // Admin accediendo a otro usuario
      this.usuarioService.getById(this.id).subscribe({
        next: (data) => {
          if (data) {
            this.usuario = data;
            this.initUserForm();
            this.loadFacturacion();
          }
        },
        error: (err) => console.error('Error al obtener usuario:', err)
      });
    } else {
      // Usuario normal
      this.usuario = this.sharedService.getLoggedUser()!;
      this.initUserForm();
      this.loadFacturacion();
    }
  }

  private initUserForm(): void {
    this.userForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      apellido1: [this.usuario.apellido1, Validators.required],
      apellido2: [this.usuario.apellido2, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
      telefono: [this.usuario.telefono]
    });
  }

  private loadFacturacion(): void {
    this.facturacionService.getByUserId(this.usuario.id_usuario).subscribe({
      next: (detalles) => {
        this.detalles = detalles;
        this.facturacionForm = this.fb.group({
          direccion: [detalles.direccion, Validators.required],
          ciudad: [detalles.ciudad, Validators.required],
          provincia: [detalles.provincia],
          codigo_postal: [detalles.codigo_postal],
          pais: [detalles.pais, Validators.required],
          nif_cif: [detalles.nif_cif]
        });
      },
      error: (err) => console.error('Error al obtener detalles de facturación:', err)
    });
  }

  guardarCambios(): void {
    if (!this.usuario || this.userForm.invalid || !this.facturacionForm || this.facturacionForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    const usuarioActualizado: Usuario = {
      ...this.usuario,
      ...this.userForm.value
    };

    const facturacionActualizada: DetallesFacturacion = {
      ...this.detalles,
      ...this.facturacionForm.value,
      id_usuario: this.usuario.id_usuario
    };

    this.usuarioService.put(usuarioActualizado).subscribe({
      next: () => {
        console.log('Usuario actualizado');
        if(!this.id) {
          this.sharedService.setLoggedUser(usuarioActualizado);
        } else {
          this.router.navigate(['main/admin/users'])
        }
      },
      error: (err) => console.error(err)
    });

    this.facturacionService.put(facturacionActualizada).subscribe({
      next: () => console.log('Detalles de facturación actualizados'),
      error: (err) => console.error(err)
    });
  }
}
