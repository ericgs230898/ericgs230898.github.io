import { Injectable } from '@angular/core';
import palabrasData from '../assets/palabras.json'

export type PlayerRole = 'Impostor' | 'Jugador normal';

interface WordWithHint {
  palabra: string;
  pista: string;
}

type WordEntry = string | WordWithHint;

export interface Player {
  id: number;
  name: string;
  role?: PlayerRole; // Se asigna tras configurar
  revealed: boolean; // Controla si ya vio su tarjeta
  word?: string; // Palabra asignada solo a jugadores normales
  hint?: string; // Pista asignada solo a impostores
}

interface GameConfigSnapshot {
  totalPlayers: number;
  impostors: number;
  names: string[];
  useHints: boolean;
}


@Injectable({ providedIn: 'root' })
export class GameStateService {
  private players: Player[] = [];
  private impostorCount = 0;
  private rolesAssigned = false;
  private currentWord = '';
  private currentHint = '';
  private useHints = true;
  private readonly wordList: WordEntry[];
  private readonly validWords: WordWithHint[];

  constructor() {
    // Cargar palabras desde el archivo JSON
    this.wordList = palabrasData.palabras as WordEntry[];
    // Filtrar solo las palabras que tienen formato completo con pista
    this.validWords = this.wordList.filter((item): item is WordWithHint => 
      typeof item === 'object' && 'palabra' in item && 'pista' in item
    );
  }

  /** Configura el juego creando la lista de jugadores y limpiando estado previo */
  configureGame(totalPlayers: number, names: string[], impostors: number, useHints: boolean = true) {
    this.impostorCount = impostors;
    this.useHints = useHints;
    const adjusted = names.slice(0, totalPlayers);
    while (adjusted.length < totalPlayers) {
      adjusted.push(`Jugador ${adjusted.length + 1}`);
    }
    this.players = adjusted.map((n, idx) => ({ id: idx, name: n.trim(), revealed: false }));
    this.rolesAssigned = false;
  }

  /** Asigna roles aleatorios respetando el número de impostores */
  assignRolesIfNeeded() {
    if (this.rolesAssigned) return;
    const indices = Array.from({ length: this.players.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const impostorIndices = new Set(indices.slice(0, this.impostorCount));
    // Seleccionar palabra y pista aleatoria para esta ronda (solo palabras válidas con pista)
    const selected = this.validWords[Math.floor(Math.random() * this.validWords.length)];
    this.currentWord = selected.palabra;
    this.currentHint = selected.pista;
    
    this.players = this.players.map(p => ({
      ...p,
      role: impostorIndices.has(p.id) ? 'Impostor' : 'Jugador normal',
      word: impostorIndices.has(p.id) ? undefined : this.currentWord,
      hint: impostorIndices.has(p.id) && this.useHints ? this.currentHint : undefined
    }));
    this.rolesAssigned = true;
  }

  /** Inicia una nueva ronda manteniendo jugadores y número de impostores */
  newRound() {
    if (!this.isConfigured()) return;
    this.players = this.players.map(p => ({ id: p.id, name: p.name, revealed: false }));
    this.rolesAssigned = false;
    this.currentWord = '';
    this.currentHint = '';
    this.assignRolesIfNeeded();
  }

  /** Snapshot de configuración actual para re-edición */
  getConfig(): GameConfigSnapshot | null {
    if (!this.isConfigured()) return null;
    return {
      totalPlayers: this.players.length,
      impostors: this.impostorCount,
      names: this.players.map(p => p.name),
      useHints: this.useHints
    };
  }

  getPlayers(): Player[] { return this.players; }
  getImpostorCount(): number { return this.impostorCount; }
  isConfigured(): boolean { return this.players.length > 0; }

  /** Marca jugador como revelado, evitando reabrir su tarjeta */
  markRevealed(id: number) {
    this.players = this.players.map(p => p.id === id ? { ...p, revealed: true } : p);
  }
}
