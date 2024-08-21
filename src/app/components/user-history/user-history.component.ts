import { Component, Inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { CookieService } from 'ngx-cookie-service';
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
  selector: 'app-user-history',
  template: `
    <nb-card>
      <nb-card-header>Historial de {{ username }}</nb-card-header>
      <nb-card-body>
        <nb-list>
          <nb-list-item *ngFor="let game of userHistory">
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
export class UserHistoryComponent implements OnInit {
  username: string = '';
  userHistory: GameHistory[] = [];

  constructor(
    private dialogRef: NbDialogRef<UserHistoryComponent>,
    private gameHistoryService: GameHistoryService,
    private cookieService: CookieService
  ) {
    this.username = cookieService.get('history-user');
    cookieService.delete('history-user');
  }


  ngOnInit() {
    this.username = this.username;
    this.userHistory = this.gameHistoryService.getUserHistory(this.username);
    console.log("historial: "+this.userHistory);
    console.log("username: "+this.username);
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