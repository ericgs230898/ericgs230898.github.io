import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStateService, Player } from '../../services/game-state.service';
import { PlayerCardComponent } from '../player-card/player-card.component';

@Component({
	selector: 'app-player-cards',
	standalone: true,
	imports: [CommonModule, PlayerCardComponent],
	templateUrl: './player-cards.component.html',
	styleUrls: ['./player-cards.component.css']
})
export class PlayerCardsComponent implements OnInit {
	players: Player[] = [];
	selected: Player | null = null;

	constructor(private readonly game: GameStateService, private readonly router: Router) {}

	ngOnInit(): void {
		if (!this.game.isConfigured()) {
			this.router.navigate(['/']);
			return;
		}
		this.game.assignRolesIfNeeded();
		this.players = this.game.getPlayers();
	}

	openPlayer(p: Player) { this.selected = p; }
	closeModal(confirm: boolean) {
		if (confirm && this.selected) {
			this.game.markRevealed(this.selected.id);
			this.players = this.game.getPlayers();
		}
		this.selected = null;
	}

	nuevaRonda() {
		this.game.newRound();
		this.players = this.game.getPlayers();
	}

	editarParametros() {
		this.router.navigate(['/impostor']);
	}
}
