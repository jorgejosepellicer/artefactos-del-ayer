import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../../../../services/usuario.service';
import { Usuario } from '../../../../../../interfaces/usuario';

@Component({
  selector: 'app-user-details',
  imports: [],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  usuarioService: UsuarioService = inject(UsuarioService);
  router: Router = inject(Router);

  id: number = this.activatedRoute.snapshot.params['id'];
  user!: Usuario;

  ngOnInit(): void {
    this.usuarioService.getById(this.id).subscribe({
      next: (data) => {
        if(data) {
          this.user = data;
        }
      },
      error: (err) => console.error(err)
    })
  }

}
