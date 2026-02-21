import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Card, DIFFICULTY_CONFIG } from '../../models/card.model';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-card-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-selection.component.html',
  styleUrl: './card-selection.component.css',
})
export class CardSelectionComponent implements OnInit {
  cards: Card[] = [];
  selectedCards: (Card | null)[] = [null, null, null, null];
  difficultyConfig = DIFFICULTY_CONFIG;
  showSelectionModal: boolean = false;
  currentCardForSelection: Card | null = null;
  currentSlotIndex: number = -1;
  currentTeam: number = 1;
  currentRound: number = 1;
  totalRounds: number = 4;
  teamNames = { team1: 'Equipo 1', team2: 'Equipo 2' };
  currentTeamName: string = '';

  constructor(
    private readonly gameStateService: GameStateService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.cards = this.gameStateService.generateCards();
    this.currentTeam = this.gameStateService.getCurrentTeam();
    this.currentRound = this.gameStateService.getCurrentRoundNumber();
    this.totalRounds = this.gameStateService.getTotalRounds();
    this.teamNames = this.gameStateService.getTeamNames();
    this.currentTeamName = this.gameStateService.getCurrentTeamName();
  }

  isExtraRound(): boolean {
    return this.currentRound > this.totalRounds;
  }

  openCardSelection(index: number) {
    this.currentSlotIndex = index;
    this.currentCardForSelection = this.cards[index];
    this.showSelectionModal = true;
  }

  confirmExit() {
    const confirmed = confirm(
      '¿Estás seguro de que quieres salir?\n\n' +
      'Se perderá todo el progreso de la partida actual.'
    );
    if (confirmed) {
      this.goBack();
    }
  }

  selectWord(word: string) {
    if (this.currentCardForSelection && this.currentSlotIndex !== -1) {
      const cardCopy = { ...this.currentCardForSelection, selectedWord: word };
      this.selectedCards[this.currentSlotIndex] = cardCopy;
      this.closeModal();
    }
  }

  closeModal() {
    this.showSelectionModal = false;
    this.currentCardForSelection = null;
    this.currentSlotIndex = -1;
  }

  canStartRound(): boolean {
    return this.selectedCards.every(card => card !== null && card.selectedWord);
  }

  startRound() {
    if (!this.canStartRound()) return;

    const cardsWithSelection = this.selectedCards.filter(c => c !== null) as Card[];
    this.gameStateService.startRound(cardsWithSelection);
    this.router.navigate(['/gestos/game']);
  }

  goBack() {
    this.router.navigate(['/gestos']);
  }
}
