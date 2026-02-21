import { Routes } from '@angular/router';

import { SetupGameComponent } from './games/impostor/components/setup-game/setup-game.component';
import { PlayerCardsComponent } from './games/impostor/components/player-cards/player-cards.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { SetupGameComponent as GestosSetupComponent } from './games/gestos/components/setup-game/setup-game.component';
import { CardSelectionComponent } from './games/gestos/components/card-selection/card-selection.component';
import { GameBoardComponent } from './games/gestos/components/game-board/game-board.component';
import { RoundSummaryComponent } from './games/gestos/components/round-summary/round-summary.component';

export const routes: Routes = [
  { path: '', component: MainMenuComponent },
  { path: 'impostor', component: SetupGameComponent },
  { path: 'players', component: PlayerCardsComponent },
  { path: 'gestos', component: GestosSetupComponent },
  { path: 'gestos/selection', component: CardSelectionComponent },
  { path: 'gestos/game', component: GameBoardComponent },
  { path: 'gestos/summary', component: RoundSummaryComponent },
  { path: '**', redirectTo: '' }
];
