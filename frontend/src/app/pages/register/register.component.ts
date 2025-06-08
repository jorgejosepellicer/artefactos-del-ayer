import { Component, inject } from '@angular/core';
import { Usuario } from '../../interfaces/usuario';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { DetallesFacturacionService } from '../../services/detalles-facturacion.service';
import { DetallesFacturacion } from '../../interfaces/detalles-facturacion';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorMessageComponent } from "../../components/error-message/error-message.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ErrorMessageComponent
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
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

        // Guardar usuario en localStorage (sin password por seguridad)
        const { password, ...userWithoutPassword } = newUser;
        localStorage.setItem("usuario", JSON.stringify(userWithoutPassword));

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
          complete: () => this.router.navigate(['/main/home'])
        });
      },
      error: err => console.error('Error registrando usuario:', err)
    });
  }
}
