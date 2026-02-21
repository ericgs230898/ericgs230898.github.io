import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStateService } from '../../services/game-state.service';

@Component({
	selector: 'app-setup-game',
	standalone: true,
	imports: [FormsModule, CommonModule],
	templateUrl: './setup-game.component.html',
	styleUrls: ['./setup-game.component.css']
})
export class SetupGameComponent implements OnInit {
	totalPlayers = 4;
	impostors = 1;
	names: string[] = [];
	errorMsg = '';
	useHints = true;

	constructor(private readonly game: GameStateService, private readonly router: Router) {}

	ngOnInit(): void {
		const cfg = this.game.getConfig();
		if (cfg) {
			this.totalPlayers = cfg.totalPlayers;
			this.impostors = cfg.impostors;
			this.names = [...cfg.names];
			this.useHints = cfg.useHints;
		} else {
			// Inicializar nombres solo si no hay configuración previa
			this.names = new Array(this.totalPlayers).fill('').map((_, i) => `Jugador ${i + 1}`);
		}
	}


	onTotalPlayersChange() {
		if (this.totalPlayers < 1) this.totalPlayers = 1;
    
		// Solo agregar nombres si hay menos de los necesarios
		if (this.names.length < this.totalPlayers) {
			for (let i = this.names.length; i < this.totalPlayers; i++) {
				this.names.push(`Jugador ${i + 1}`);
			}
		} 
		// Solo eliminar nombres si hay más de los necesarios
		else if (this.names.length > this.totalPlayers) {
			this.names = this.names.slice(0, this.totalPlayers);
		}
    
		// Ajustar impostores si exceden el límite
		const maxImpostors = Math.min(10, Math.floor(this.totalPlayers / 2));
		if (this.impostors > maxImpostors) {
			this.impostors = maxImpostors || 1;
		}
		this.validate();
	}

	validate(): boolean {
		this.errorMsg = '';
		const maxImpostors = Math.floor(this.totalPlayers / 2);
		if (this.impostors > maxImpostors) {
			this.errorMsg = `El número de impostores (${this.impostors}) no puede superar la mitad de jugadores (${maxImpostors}).`;
			return false;
		}
		if (this.impostors < 1) {
			this.errorMsg = 'Debe haber al menos 1 impostor.';
			return false;
		}
		if (this.names.some(n => !n.trim())) {
			this.errorMsg = 'Todos los nombres deben estar completos.';
			return false;
		}
		return true;
	}

	trackByIndex(index: number): number {
		return index;
	}


	volverMenu() {
		this.router.navigate(['/']);
	}

	avanzar() {
		if (!this.validate()) return;
		this.game.configureGame(this.totalPlayers, this.names, this.impostors, this.useHints);
		this.router.navigate(['/players']);
	}
}
