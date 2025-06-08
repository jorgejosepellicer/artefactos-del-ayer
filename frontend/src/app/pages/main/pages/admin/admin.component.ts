import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';

@Component({
  selector: 'app-admin',
  imports: [
    RouterOutlet
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  sharedService: SharedService = inject(SharedService);
  router: Router = inject(Router)

  ngOnInit(): void {
    if(this.sharedService.getLoggedUser()!.id_rol != 1) {
      this.router.navigate(['main/home'])
    }
  }

}
