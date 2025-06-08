import { Component, inject } from '@angular/core';
import { ViewerService } from '../../services/viewer.service';
import { RolService } from '../../services/rol.service';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  rolService: RolService = inject(RolService);
  viewerService: ViewerService = inject(ViewerService);
  sharedService: SharedService = inject(SharedService);
  router: Router = inject(Router);

  toggleCategories() {
    this.viewerService.toggle('categorias');
  }

  canActivate(): boolean {
    return this.sharedService.getLoggedUser()!.id_rol === 1;
  }
}
