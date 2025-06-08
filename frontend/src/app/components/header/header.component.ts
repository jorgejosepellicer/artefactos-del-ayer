import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../../interfaces/usuario';
import { SharedService } from '../../services/shared.service';
import { NavbarComponent } from "../navbar/navbar.component";
import { AsideCategoriesComponent } from './aside/aside-categories/aside-categories.component';

@Component({
  selector: 'app-header',
  imports: [
    FormsModule,
    NavbarComponent,
    AsideCategoriesComponent
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  sharedService: SharedService = inject(SharedService);
  router: Router = inject(Router);

  user!: Usuario | null;

  ngOnInit() {
    this.user = this.sharedService.getLoggedUser();

    if (!this.user) {
      this.router.navigate(['']);
    }
  }
}
