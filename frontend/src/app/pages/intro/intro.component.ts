import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from '../../components/login/login.component';
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-intro',
  imports: [
    LoginComponent,
    FooterComponent
  ],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.css'
})
export class IntroComponent implements OnInit {
  router: Router = inject(Router);

  ngOnInit() {
    if (localStorage.getItem('usuario')) {
      this.router.navigate(['/main/home']);
    }
  }

  register() {
    this.router.navigate(['/register']);
  }
}
