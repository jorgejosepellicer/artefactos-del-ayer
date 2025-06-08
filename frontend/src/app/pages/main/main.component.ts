import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from "../../components/footer/footer.component";
import { SpinnerService } from '../../services/spinner.service';
import { SpinnerComponent } from "../../components/spinner/spinner.component";
@Component({
  selector: 'app-main',
  imports: [
    HeaderComponent,
    RouterOutlet,
    FooterComponent,
    SpinnerComponent,
],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
spinnerService: SpinnerService = inject(SpinnerService);
isLoading = this.spinnerService.isLoading;
}
