import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Card, GameRound, DIFFICULTY_CONFIG } from '../../models/card.model';
import { GameStateService } from '../../services/game-state.service';

interface CardPosition {
  card: Card;
  startY: number;
  currentY: number;
  isDragging: boolean;
  isFalling: boolean;
  isShaking: boolean;
  shakeCount: number;
}

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.css',
})
export class GameBoardComponent implements OnInit, OnDestroy {
  round: GameRound | null = null;
  cardPositions: CardPosition[] = [];
  difficultyConfig = DIFFICULTY_CONFIG;
  timer: any;
  isRoundActive: boolean = false;
  timeProgress: number = 100;
  isTimerWarning: boolean = false;
  currentTeam: number = 1;
  cardsDroppedByTime: Set<number> = new Set();
  cardsShaking: Set<number> = new Set();
  currentRound: number = 1;
  totalRounds: number = 4;
  teamScores = { team1: 0, team2: 0 };
  teamNames = { team1: 'Equipo 1', team2: 'Equipo 2' };
  currentTeamName: string = '';

  constructor(
    private readonly gameStateService: GameStateService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.round = this.gameStateService.getCurrentRound();
    this.currentTeam = this.gameStateService.getCurrentTeam();
    this.currentRound = this.gameStateService.getCurrentRoundNumber();
    this.totalRounds = this.gameStateService.getTotalRounds();
    this.teamScores = this.gameStateService.getTeamScores();
    this.teamNames = this.gameStateService.getTeamNames();
    this.currentTeamName = this.gameStateService.getCurrentTeamName();
    
    if (!this.round) {
      this.router.navigate(['/gestos']);
      return;
    }

    this.initializeCardPositions();
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  isExtraRound(): boolean {
    // Es ronda extra si ya superamos el total de rondas configuradas
    // (ambos equipos ya jugaron todas sus rondas)
    return this.currentRound > this.totalRounds;
  }

  initializeCardPositions() {
    if (!this.round) return;

    this.cardPositions = this.round.cards.map(card => ({
      card,
      startY: 0,
      currentY: 0,
      isDragging: false,
      isFalling: false,
      isShaking: false,
      shakeCount: 0
    }));
  }

  startTimer() {
    this.isRoundActive = true;
    this.cardsDroppedByTime.clear();
    this.cardsShaking.clear();
    
    this.timer = setInterval(() => {
      if (!this.round) return;

      this.round.timeRemaining--;
      this.timeProgress = (this.round.timeRemaining / this.round.timeLimit) * 100;

      // Advertencia en los últimos 10 segundos
      this.isTimerWarning = this.round.timeRemaining <= 10;

      // Calcular el progreso del tiempo (de 100% a 0%)
      const timeElapsedPercent = 100 - this.timeProgress;

      // Iniciar vibración 3 segundos antes de cada umbral
      this.checkAndShakeCardsByTime(timeElapsedPercent);

      // Hacer caer cartas según el progreso del tiempo
      this.checkAndDropCardsByTime(timeElapsedPercent);

      if (this.round.timeRemaining <= 0) {
        this.endRound();
      }
    }, 1000);
  }

  checkAndShakeCardsByTime(timeElapsedPercent: number) {
    if (!this.round) return;

    // Calcular cuántos segundos han transcurrido y cuántos son 3 segundos antes del umbral
    const timeElapsed = this.round.timeLimit - this.round.timeRemaining;
    const timeLimit = this.round.timeLimit;

    // Thresholds en segundos (3 segundos antes de cada umbral)
    const shakeThresholds = [
      { index: 0, shakeAt: Math.floor(timeLimit * 0.25) - 3 },  // 3s antes del 25%
      { index: 1, shakeAt: Math.floor(timeLimit * 0.50) - 3 },  // 3s antes del 50%
      { index: 2, shakeAt: Math.floor(timeLimit * 0.75) - 3 },  // 3s antes del 75%
      { index: 3, shakeAt: timeLimit - 3 }                       // 3s antes del 100%
    ];

    shakeThresholds.forEach((config) => {
      if (timeElapsed >= config.shakeAt && !this.cardsShaking.has(config.index)) {
        const cardPos = this.cardPositions[config.index];
        if (cardPos && !cardPos.card.isCompleted && !cardPos.isFalling) {
          this.cardsShaking.add(config.index);
          this.startCardShake(config.index);
        }
      }
    });
  }

  startCardShake(index: number) {
    const cardPos = this.cardPositions[index];
    cardPos.isShaking = true;
    cardPos.shakeCount = 0;

    // Vibrar 3 veces (una por segundo)
    const shakeInterval = setInterval(() => {
      cardPos.shakeCount++;
      
      // Después de 3 vibraciones, detener
      if (cardPos.shakeCount >= 3) {
        clearInterval(shakeInterval);
        cardPos.isShaking = false;
      }
    }, 1000);
  }

  checkAndDropCardsByTime(timeElapsedPercent: number) {
    // Mapeo de dificultad a índice de carta (asumiendo orden: fácil, normal, difícil, muy difícil)
    const cardsByDifficulty = [
      { difficulty: 1, threshold: 25 },  // Fácil cae al 25% del tiempo
      { difficulty: 2, threshold: 50 },  // Normal cae al 50%
      { difficulty: 3, threshold: 75 },  // Difícil cae al 75%
      { difficulty: 4, threshold: 100 }  // Muy difícil cae al 100%
    ];

    cardsByDifficulty.forEach((config, index) => {
      if (timeElapsedPercent >= config.threshold && !this.cardsDroppedByTime.has(index)) {
        const cardPos = this.cardPositions[index];
        if (cardPos && !cardPos.card.isCompleted && !cardPos.isFalling) {
          this.cardsDroppedByTime.add(index);
          this.dropCardAutomatically(index);
        }
      }
    });
  }

  dropCardAutomatically(index: number) {
    const cardPos = this.cardPositions[index];
    cardPos.isFalling = true;
    cardPos.isShaking = false; // Detener vibración
    cardPos.isDragging = false; // Cancelar cualquier drag en progreso
    cardPos.card.isCorrect = false; // No se recogió a tiempo
    
    // Animación de caída suave
    const fallAnimation = setInterval(() => {
      cardPos.currentY += 30;
      if (cardPos.currentY >= 800) {
        clearInterval(fallAnimation);
        // Marcar como fallida en el servicio
        this.gameStateService.markCardAsFailed(cardPos.card.id);
        
        // Verificar si todas las tarjetas están completadas
        if (this.areAllCardsCompleted()) {
          this.endRound();
        }
      }
    }, 16);
  }

  onTouchStart(event: TouchEvent, index: number) {
    const cardPos = this.cardPositions[index];
    if (cardPos.card.isCompleted || cardPos.isFalling || this.cardsDroppedByTime.has(index)) return;

    cardPos.isDragging = true;
    cardPos.isShaking = false; // Detener vibración al empezar drag
    cardPos.startY = event.touches[0].clientY;
    event.preventDefault();
  }

  onTouchMove(event: TouchEvent, index: number) {
    const cardPos = this.cardPositions[index];
    if (!cardPos.isDragging || cardPos.card.isCompleted || cardPos.isFalling) return;

    const deltaY = event.touches[0].clientY - cardPos.startY;
    
    // Solo permitir deslizar hacia arriba (valores negativos)
    if (deltaY < 0) {
      cardPos.currentY = deltaY;
    }
    
    event.preventDefault();
  }

  onTouchEnd(event: TouchEvent, index: number) {
    const cardPos = this.cardPositions[index];
    if (!cardPos.isDragging) return;

    cardPos.isDragging = false;

    // Si la carta ya está marcada para caer o está cayendo, no permitir recogerla
    if (cardPos.isFalling || this.cardsDroppedByTime.has(index)) {
      cardPos.currentY = 0;
      return;
    }

    // Si se deslizó más de 100px hacia arriba (valor negativo), marcar como correcto
    if (cardPos.currentY < -100) {
      this.pickUpCard(index);
    } else {
      // Volver a la posición original
      cardPos.currentY = 0;
    }
    
    event.preventDefault();
  }

  onMouseDown(event: MouseEvent, index: number) {
    const cardPos = this.cardPositions[index];
    if (cardPos.card.isCompleted || cardPos.isFalling || this.cardsDroppedByTime.has(index)) return;

    cardPos.isDragging = true;
    cardPos.isShaking = false; // Detener vibración al empezar drag
    cardPos.startY = event.clientY;
    event.preventDefault();
  }

  onMouseMove(event: MouseEvent, index: number) {
    const cardPos = this.cardPositions[index];
    if (!cardPos.isDragging || cardPos.card.isCompleted || cardPos.isFalling) return;

    const deltaY = event.clientY - cardPos.startY;
    
    // Solo permitir deslizar hacia arriba
    if (deltaY < 0) {
      cardPos.currentY = deltaY;
    }
    
    event.preventDefault();
  }

  onMouseUp(event: MouseEvent, index: number) {
    const cardPos = this.cardPositions[index];
    if (!cardPos.isDragging) return;

    cardPos.isDragging = false;

    // Si la carta ya está marcada para caer o está cayendo, no permitir recogerla
    if (cardPos.isFalling || this.cardsDroppedByTime.has(index)) {
      cardPos.currentY = 0;
      return;
    }

    if (cardPos.currentY < -100) {
      this.pickUpCard(index);
    } else {
      cardPos.currentY = 0;
    }
    
    event.preventDefault();
  }

  pickUpCard(index: number) {
    const cardPos = this.cardPositions[index];
    cardPos.isFalling = true;
    cardPos.card.isCorrect = true;
    
    // Animación de subida
    const riseAnimation = setInterval(() => {
      cardPos.currentY -= 30;
      if (cardPos.currentY <= -800) {
        clearInterval(riseAnimation);
        this.gameStateService.markCardAsCorrect(cardPos.card.id);
        
        // Verificar si todas las tarjetas están completadas
        if (this.areAllCardsCompleted()) {
          this.endRound();
        }
      }
    }, 16);
  }

  areAllCardsCompleted(): boolean {
    return this.cardPositions.every(cardPos => cardPos.card.isCompleted);
  }

  confirmExit() {
    const confirmed = confirm(
      '¿Estás seguro de que quieres salir?\n\n' +
      'Se perderá todo el progreso de la partida actual.'
    );
    if (confirmed) {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.gameStateService.resetGame();
      this.router.navigate(['/']);
    }
  }

  endRound() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    
    this.isRoundActive = false;
    this.gameStateService.endRound();

    // Hacer caer todas las tarjetas no completadas
    this.cardPositions.forEach((cardPos, index) => {
      if (!cardPos.card.isCompleted && !cardPos.isFalling) {
        cardPos.isFalling = true;
        setTimeout(() => {
          const fallAnimation = setInterval(() => {
            cardPos.currentY += 30;
            if (cardPos.currentY >= 800) {
              clearInterval(fallAnimation);
            }
          }, 16);
        }, index * 200); // Caída escalonada
      }
    });

    // Navegar al resumen después de las animaciones
    setTimeout(() => {
      this.router.navigate(['/gestos/summary']);
    }, 2000);
  }

  getCardStyle(cardPos: CardPosition) {
    return {
      transform: `translateY(${cardPos.currentY}px)`,
      opacity: cardPos.currentY > 400 || cardPos.currentY < -400 ? 0 : 1,
      transition: cardPos.isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
      animation: cardPos.isDragging ? 'none' : undefined // Desactivar animaciones durante drag
    };
  }
}

