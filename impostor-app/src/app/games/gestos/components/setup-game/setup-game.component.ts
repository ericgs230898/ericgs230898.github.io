import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-setup-game',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './setup-game.component.html',
  styleUrl: './setup-game.component.css',
})
export class SetupGameComponent {
  timePerRound: number = 90;
  totalRounds: number = 4;
  team1Name: string = 'Equipo 1';
  team2Name: string = 'Equipo 2';

  constructor(
    private readonly router: Router,
    private readonly gameStateService: GameStateService
  ) {}

  startGame() {
    this.gameStateService.resetGame();
    this.gameStateService.setTimePerRound(this.timePerRound);
    this.gameStateService.setTotalRounds(this.totalRounds);
    this.gameStateService.setTeamNames({
      team1: this.team1Name.trim() || 'Equipo 1',
      team2: this.team2Name.trim() || 'Equipo 2'
    });
    this.router.navigate(['/gestos/selection']);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
