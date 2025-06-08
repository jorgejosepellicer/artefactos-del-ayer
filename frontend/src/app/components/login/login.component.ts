import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../interfaces/usuario';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { ErrorMessageComponent } from "../error-message/error-message.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ErrorMessageComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  router: Router = inject(Router);
  usuarioService: UsuarioService = inject(UsuarioService);
  sharedService: SharedService = inject(SharedService);

  email: string = '';
  password: string = '';
  usuario: Usuario | null = null;

  errorMessage: string | null = null;

  login(): void {
    this.errorMessage = null;

    if (!this.email || !this.password) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    this.usuarioService.getByEmail(this.email).subscribe({
      next: (user) => {
        if (!user) {
          this.errorMessage = 'Usuario no encontrado.';
        } else if (user.password !== this.password) {
          this.errorMessage = 'Contraseña incorrecta.';
        } else {
          localStorage.setItem('usuario', JSON.stringify(user));
          this.sharedService.setLoggedUser(user);
          this.router.navigate(['/main/home']);
        }
      },
      error: () => {
        this.errorMessage = 'Ocurrió un error al iniciar sesión.';
      }
    });
  }
}
