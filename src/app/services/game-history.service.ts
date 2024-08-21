import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})


export class GameHistoryService {
  private gameHistory: GameHistory[] = [];
  private historySubject = new BehaviorSubject<GameHistory[]>(this.gameHistory);

  getHistory() {
    return this.historySubject.asObservable();
  }

  addGame(winners: any[], players: any[], room_code: string) {
    const newGame: GameHistory = {
      id: this.generateId(),
      winners: winners,
      date: new Date(),
      players: players,
      room_code: room_code,
    };
    this.gameHistory.push(newGame);
    this.historySubject.next(this.gameHistory);
  }

  getUserHistory(username: string): GameHistory[] {
    console.log("historial general: "+this.gameHistory);
    return this.gameHistory.filter(game => game.players.some(player => player.nickname === username));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }}
