import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../services/game-state.service';

@Component({
	selector: 'app-player-card',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './player-card.component.html',
	styleUrls: ['./player-card.component.css']
})
export class PlayerCardComponent {
	@Input() player!: Player;
	@Output() open = new EventEmitter<Player>();

	handleClick() {
		if (this.player.revealed) return;
		this.open.emit(this.player);
	}
}
