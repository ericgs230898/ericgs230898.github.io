import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameRound, DIFFICULTY_CONFIG } from '../../models/card.model';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-round-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './round-summary.component.html',
  styleUrl: './round-summary.component.css',
})
export class RoundSummaryComponent implements OnInit {
  round: GameRound | null = null;
  teamScores = { team1: 0, team2: 0 };
  difficultyConfig = DIFFICULTY_CONFIG;
  currentTeam: number = 1;
  currentRound: number = 1;
  totalRounds: number = 4;
  isGameFinished: boolean = false;
  winnerTeam: number = 0;
  teamNames = { team1: 'Equipo 1', team2: 'Equipo 2' };
  currentTeamName: string = '';
  winnerTeamName: string = '';

  constructor(
    private readonly gameStateService: GameStateService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.round = this.gameStateService.getCurrentRound();
    this.teamScores = this.gameStateService.getTeamScores();
    this.currentTeam = this.gameStateService.getCurrentTeam();
    this.currentRound = this.gameStateService.getCurrentRoundNumber();
    this.totalRounds = this.gameStateService.getTotalRounds();
    this.isGameFinished = this.gameStateService.isGameFinished();
    this.teamNames = this.gameStateService.getTeamNames();
    this.currentTeamName = this.gameStateService.getCurrentTeamName();

    if (!this.round) {
      this.router.navigate(['/gestos']);
      return;
    }

    // Determinar ganador si el juego ha terminado
    if (this.isGameFinished) {
      if (this.teamScores.team1 > this.teamScores.team2) {
        this.winnerTeam = 1;
        this.winnerTeamName = this.teamNames.team1;
      } else if (this.teamScores.team2 > this.teamScores.team1) {
        this.winnerTeam = 2;
        this.winnerTeamName = this.teamNames.team2;
      } else {
        this.winnerTeam = 0; // Empate - permite continuar
      }
    }
  }

  isTie(): boolean {
    return this.teamScores.team1 === this.teamScores.team2;
  }

  nextRound() {
    this.gameStateService.nextRound();
    this.router.navigate(['/gestos/selection']);
  }

  playTiebreaker() {
    // Continuar con una ronda de desempate
    this.gameStateService.nextRound();
    this.router.navigate(['/gestos/selection']);
  }

  confirmExit() {
    if (this.isGameFinished) {
      // Si el juego terminó, salir directamente
      this.goToMenu();
    } else {
      // Si aún hay rondas, pedir confirmación
      const confirmed = confirm(
        '¿Estás seguro de que quieres salir?\n\n' +
        'Se perderá todo el progreso de la partida actual.'
      );
      if (confirmed) {
        this.goToMenu();
      }
    }
  }

  playAgain() {
    this.gameStateService.resetGame();
    this.router.navigate(['/gestos']);
  }

  goToMenu() {
    this.gameStateService.resetGame();
    this.router.navigate(['/']);
  }
}
