import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Usuario } from '../../interfaces/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-target',
  imports: [],
  templateUrl: './user-target.component.html',
  styleUrl: './user-target.component.css'
})
export class UserTargetComponent {
  router: Router = inject(Router);
  
  @Input() user!: Usuario;
  @Output() clickDelete = new EventEmitter;

  deleteClicked() {
    this.clickDelete.emit(this.user);
  }
}
