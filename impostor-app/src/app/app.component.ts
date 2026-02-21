import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  gameTitle = '';
  showTitle = true;

  constructor(private readonly router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateTitle(event.url);
    });
    
    // Inicializar título
    this.updateTitle(this.router.url);
  }

  private updateTitle(url: string): void {
    if (url.includes('gestos')) {
      this.gameTitle = 'Gestos';
      this.showTitle = false; // Las pantallas de Gestos ya tienen sus propios títulos
    } else if (url.includes('impostor') || url.includes('players')) {
      this.gameTitle = 'Juego del Impostor';
      this.showTitle = true;
    } else {
      this.gameTitle = '';
      this.showTitle = false; // Menú principal no necesita título
    }
  }
}
