import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../../../../services/usuario.service';
import { DetallesFacturacionService } from '../../../../../../services/detalles-facturacion.service';
import { Usuario } from '../../../../../../interfaces/usuario';
import { DetallesFacturacion } from '../../../../../../interfaces/detalles-facturacion';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-user',
  imports: [FormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent {
  router = inject(Router);
  usuarioService = inject(UsuarioService);
  detallesFacturacionService = inject(DetallesFacturacionService);

  usuario: Usuario = {
    id_usuario: 0,
    nombre: "",
    apellido1: "",
    apellido2: "",
    nickname: "",
    email: "",
    telefono: 0,
    password: "",
    id_rol: 2
  };

  register(usuario: Usuario) {
    this.usuarioService.post(usuario).subscribe({
      next: (created: any) => {
        // created debería ser el objeto usuario con id_usuario
        const newUser = typeof created === 'object' ? created : { ...usuario, id_usuario: created };

        // Crear detalles de facturación vacíos para el nuevo usuario
        const detalles: DetallesFacturacion = {
          id_detalle: 0,
          id_usuario: newUser.id_usuario,
          direccion: '',
          ciudad: '',
          provincia: '',
          codigo_postal: '',
          pais: '',
          nif_cif: ''
        };

        this.detallesFacturacionService.post(detalles).subscribe({
          next: () => console.log('Detalles de facturación creados para el nuevo usuario'),
          error: err => console.error('Error creando detalles de facturación:', err),
          complete: () => this.router.navigate(['/main/admin/users'])
        });
      },
      error: err => console.error('Error registrando usuario:', err)
    });
  }
}
