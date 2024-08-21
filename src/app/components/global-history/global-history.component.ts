import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { GameHistoryService } from 'src/app/services/game-history.service';
interface GameHistory {
  id: string;
  winners: {
    nickname: string
  }[],
  date: Date
  players: {
    nickname: string
  }[],
  room_code: string
}
@Component({
  selector: 'app-global-history',
  template: `
    <nb-card>
      <nb-card-header>Historial de Partidas</nb-card-header>
      <nb-card-body>
        <nb-list>
          <nb-list-item *ngFor="let game of gameHistory">
            <nb-list-item>
              <p><strong>Fecha:</strong> {{ game.date | date }} - </p>
              <p><strong>Ganadores:</strong> {{ formatWinners(game.winners) }} - </p>
              <p><strong>Jugadores:</strong> {{ formatPlayers(game.players) }} - </p>
              <p><strong>Código de Sala:</strong> {{ game.room_code }} - </p>
            </nb-list-item>
          </nb-list-item>
        </nb-list>
      </nb-card-body>
      <nb-card-footer>
        <button nbButton status="primary" (click)="close()">Cerrar</button>
      </nb-card-footer>
    </nb-card>
  `,
})
export class GlobalHistoryComponent implements OnInit {
  gameHistory: GameHistory[] = [];

  constructor(
    private dialogRef: NbDialogRef<GlobalHistoryComponent>,
    private gameHistoryService: GameHistoryService
  ) {}

  ngOnInit() {
    this.gameHistoryService.getHistory().subscribe(history => {
      this.gameHistory = history;
    });
  }

  formatWinners(winners: { nickname: string }[]): string {
    return winners.map(winner => winner.nickname).join(', ');
  }

  formatPlayers(players: { nickname: string }[]): string {
    return players.map(player => player.nickname).join(', ');
  }

  close() {
    this.dialogRef.close();
  }
}