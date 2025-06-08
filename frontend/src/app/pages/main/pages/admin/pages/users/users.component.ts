import { Component, inject, OnInit } from '@angular/core';
import { UsuarioService } from '../../../../../../services/usuario.service';
import { Usuario } from '../../../../../../interfaces/usuario';
import { UserTargetComponent } from "../../../../../../components/user-target/user-target.component";
import { Router } from '@angular/router';
import { SharedService } from '../../../../../../services/shared.service';
import { ModalComponent } from "../../../../../../components/modal/modal.component";

@Component({
  selector: 'app-users',
  imports: [UserTargetComponent, ModalComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  router: Router = inject(Router)
  usuarioService: UsuarioService = inject(UsuarioService);
  sharedService: SharedService = inject(SharedService);

  usersList!: Usuario[];
  usuario!: Usuario;

  ngOnInit(): void {
    this.usuarioService.getAll().subscribe({
      next: (data) => this.usersList = data,
      error: (err) => console.error(err)
    })
  }

  handleClickDelete(event: any) {
    this.usuario = event;
    this.openCommonModal('deleteUser');
  }

  acceptModal(): void {
    this.deleteUser();
    this.sharedService.updateCommonModal('', false);
  }

  deleteUser(): void {
    if (!this.usuario) {
      alert('Ha habido un error');
      return;
    }

    this.usuarioService.delete(this.usuario.id_usuario).subscribe({
      complete: () => {
        alert('Usuario eliminado');
        const index = this.usersList.findIndex(u => u.id_usuario === this.usuario.id_usuario);
        if (index !== -1) {
          this.usersList.splice(index, 1);
        }
      },
      error: (err) => console.error('Error eliminando usuario', err)
    });
  }

  openCommonModal(type: string): void {
    this.sharedService.updateCommonModal(type, true);
  }

}
