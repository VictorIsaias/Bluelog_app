import { Component } from '@angular/core';
import { GamesService } from 'src/app/services/games-alerts.service';

@Component({
  selector: 'app-tiktaktoe',
  templateUrl: './tiktaktoe.component.html',
  styleUrls: ['./tiktaktoe.component.scss']
})
export class TiktaktoeComponent {
  board: Array<string> = Array(9).fill('');

  currentPlayer: string = 'X';
  winner: string | null = null;

  constructor(private gameService:GamesService){

  }

  cellClicked(index: number) {
    if (!this.board[index] && !this.winner) {
      this.board[index] = this.currentPlayer;
      const res = this.checkWinner(this.board)
      if(res!=null){
        this.winner = res
        this.finishGame()
      }
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
  }

  checkWinner(board:Array<string>): string | null{
    const winningConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], 
      [0, 3, 6], [1, 4, 7], [2, 5, 8], 
      [0, 4, 8], [2, 4, 6]             
    ];

    for (const condition of winningConditions) {
      const [a, b, c] = condition;
      if (board[a] && board[a] ==board[b] && board[a] == board[c]) {
        
        return this.currentPlayer
      }
    }

    if(board===this.board){
      const tempBoardX = Array(9).fill('')
      const tempBoardO = Array(9).fill('')
      for (let index = 0; index < tempBoardX.length; index++) {
        if(this.board[index]=="O"){
          tempBoardX[index]=''
          tempBoardO[index]="O"
        }else if(this.board[index]==""){
          tempBoardX[index]="X"
          tempBoardO[index]="O"
        }else if(this.board[index]=="X"){
          tempBoardO[index]=""
          tempBoardX[index]="X"
        }
        
      }
      console.log(tempBoardO)
      console.log(tempBoardX)
      if(!this.checkWinner(tempBoardX)&&!this.checkWinner(tempBoardO)){
        return "Empate"
      }

    }
    return null
  }

  finishGame(){
    
    alert(this.winner)
    this.restartGame()
  }

  restartGame() {
    this.board = Array(9).fill('')
    this.currentPlayer = 'X'
    this.winner = null
  }
}