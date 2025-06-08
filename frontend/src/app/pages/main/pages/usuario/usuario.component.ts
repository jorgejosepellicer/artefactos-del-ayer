import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-usuario',
  imports: [
    RouterOutlet
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {
  router: Router = inject(Router);

  logout() {
    localStorage.removeItem("usuario");
    this.router.navigate(['']);
  }
}
