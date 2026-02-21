import { Injectable } from '@angular/core';
import { Card, Difficulty, GameRound, DIFFICULTY_CONFIG } from '../models/card.model';
import { WORDS_DATABASE } from '../assets/words.data';

export interface TeamScore {
  team1: number;
  team2: number;
}

export interface TeamNames {
  team1: string;
  team2: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private timePerRound: number = 90;
  private totalRounds: number = 4;
  private currentRoundNumber: number = 1;
  private currentTurn: number = 1; // 1 o 2 para indicar qué equipo juega
  private usedWords: Set<string> = new Set();
  private currentRound: GameRound | null = null;
  private teamScores: TeamScore = { team1: 0, team2: 0 };
  private teamNames: TeamNames = { team1: 'Equipo 1', team2: 'Equipo 2' };

  constructor() { }

  setTimePerRound(time: number) {
    this.timePerRound = time;
  }

  setTotalRounds(rounds: number) {
    this.totalRounds = rounds;
  }

  setTeamNames(names: TeamNames) {
    this.teamNames = { ...names };
  }

  getTotalRounds(): number {
    return this.totalRounds;
  }

  getTeamNames(): TeamNames {
    return { ...this.teamNames };
  }

  getCurrentTeamName(): string {
    return this.getCurrentTeam() === 1 ? this.teamNames.team1 : this.teamNames.team2;
  }

  getCurrentRoundNumber(): number {
    return this.currentRoundNumber;
  }

  getCurrentTeam(): number {
    return this.currentTurn;
  }

  getTimePerRound(): number {
    return this.timePerRound;
  }

  getTeamScores(): TeamScore {
    return { ...this.teamScores };
  }

  isGameFinished(): boolean {
    // El juego termina cuando:
    // - Estamos en la última ronda Y el equipo 2 acaba de jugar (turno es 2)
    // - O ya pasamos la última ronda (para casos de desempate)
    if (this.currentRoundNumber === this.totalRounds && this.currentTurn === 2) {
      return true; // Ambos equipos jugaron la última ronda
    }
    return this.currentRoundNumber > this.totalRounds;
  }

  generateCards(): Card[] {
    const cards: Card[] = [];
    const difficulties = [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD, Difficulty.EXPERT];
    
    for (let i = 0; i < 4; i++) {
      const difficulty = difficulties[i];
      const availableWords = WORDS_DATABASE.filter(
        w => w.difficulty === difficulty && !this.usedWords.has(w.word)
      );
      
      if (availableWords.length < 2) {
        // No hay suficientes palabras disponibles sin repetir
        throw new Error(
          `No hay suficientes palabras de dificultad ${difficulty} sin repetir. ` +
          `Palabras disponibles: ${availableWords.length}, necesarias: 2`
        );
      }

      // Seleccionar 2 palabras aleatorias
      const shuffled = [...availableWords].sort(() => Math.random() - 0.5);
      const word1 = shuffled[0].word;
      const word2 = shuffled[1].word;

      cards.push({
        id: `card-${i}-${Date.now()}`,
        word1,
        word2,
        difficulty,
        isCompleted: false
      });
    }

    return cards;
  }

  startRound(cards: Card[]): GameRound {
    // Marcar palabras seleccionadas como usadas
    for (const card of cards) {
      if (card.selectedWord) {
        this.usedWords.add(card.selectedWord);
      }
    }

    this.currentRound = {
      cards,
      timeLimit: this.timePerRound,
      timeRemaining: this.timePerRound,
      correctCards: 0,
      failedCards: 0,
      score: 0
    };

    return this.currentRound;
  }

  markCardAsCorrect(cardId: string): number {
    if (!this.currentRound) return 0;

    const card = this.currentRound.cards.find(c => c.id === cardId);
    if (!card || card.isCompleted) return 0;

    card.isCorrect = true;
    card.isCompleted = true;
    this.currentRound.correctCards++;

    const points = DIFFICULTY_CONFIG[card.difficulty].points;
    this.currentRound.score += points;
    
    // Sumar puntos al equipo actual
    const currentTeam = this.getCurrentTeam();
    if (currentTeam === 1) {
      this.teamScores.team1 += points;
    } else {
      this.teamScores.team2 += points;
    }

    return points;
  }

  markCardAsFailed(cardId: string) {
    if (!this.currentRound) return;

    const card = this.currentRound.cards.find(c => c.id === cardId);
    if (!card || card.isCompleted) return;

    card.isCorrect = false;
    card.isCompleted = true;
    this.currentRound.failedCards++;
  }

  endRound() {
    if (!this.currentRound) return;

    // Marcar todas las tarjetas no completadas como fallidas
    for (const card of this.currentRound.cards) {
      if (!card.isCompleted) {
        this.markCardAsFailed(card.id);
      }
    }
  }

  nextRound() {
    if (this.currentTurn === 1) {
      // Si el equipo 1 acaba de jugar, ahora le toca al equipo 2
      this.currentTurn = 2;
    } else {
      // Si el equipo 2 acaba de jugar, la ronda se completa
      this.currentTurn = 1;
      this.currentRoundNumber++;
    }
  }

  getCurrentRound(): GameRound | null {
    return this.currentRound;
  }

  getTotalScore(): number {
    return this.teamScores.team1 + this.teamScores.team2;
  }

  resetGame() {
    this.usedWords.clear();
    this.currentRound = null;
    this.teamScores = { team1: 0, team2: 0 };
    this.teamNames = { team1: 'Equipo 1', team2: 'Equipo 2' };
    this.timePerRound = 90;
    this.totalRounds = 4;
    this.currentRoundNumber = 1;
    this.currentTurn = 1;
  }
}
