import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.css',
})
export class MainMenuComponent {
  constructor(private router: Router) {}

  goToImpostor() {
    this.router.navigate(['/impostor']);
  }

  goToGestos() {
    this.router.navigate(['/gestos']);
  }
}
