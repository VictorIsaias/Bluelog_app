import { Component, Input , OnInit} from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { CardsDialogComponent } from '../cards-dialog/cards-dialog.component';
import { GameHistoryService } from 'src/app/services/game-history.service';

interface Card {
  name: string;
  marked: boolean;
  number: number;
  image: string;
  type?: string;
}

@Component({
  selector: 'app-loteria-host',
  templateUrl: './loteria-host.component.html',
  styleUrls: ['./loteria-host.component.scss']
})
export class LoteriaHostComponent implements OnInit {
  apiUrl = environment.apiUrl

  @Input() winners: any[] | null = null;
  @Input() myCards: Card[] = [];
  @Input() myInfo: any;
  @Input() gameInfo: any;
  @Input() players: any;
  @Input() status: string = "";
  @Input() currentCard: Card | null = null;
  
  drawnCards: Card[] = []
  availableCards: Card[] = this.myCards

  canDraw: boolean = true; 
  gameActive: boolean = true;

  constructor(private socket: Socket, private dialogService: NbDialogService, private gameHistoryService: GameHistoryService) { }

  ngOnInit() {
    this.availableCards = [...this.myCards].sort(() => Math.random() - 0.5);
    this.socket.on('game:listen', async (data:any)=>{
      if(data.room_code==this.gameInfo.room_code){
        if(data.type=="winner"){
          if (!this.winners) {
            this.winners = [data.winner];
          }else{
            this.winners.push(data.winner)
          }
          if (this.gameActive){
            this.gameActive = false;
            this.canDraw = false;
            setTimeout(() => {
              console.log(this.winners);
              this.socket.emit('game:emit', { type:"endGame", game:2, room_code: this.gameInfo.room_code, winners: this.winners });
              
            }, 5000);
          }
        }
      }
    })
  }
  get lastThreeCards(): Card[] {
    return this.drawnCards.slice(1, 4);  
  }

  openCardDialog() {
    this.dialogService.open(CardsDialogComponent, {
      context: {
        drawnCards: this.drawnCards
      }
    });
  }
  drawCard() {
    console.log(this.currentCard)
    if (!this.canDraw) {
      alert('Debes esperar 5 segundos antes de sacar otra carta');
      return;
    }

    if (this.availableCards.length > 0) {
      this.canDraw = false;  
      this.currentCard = this.availableCards.shift()!;
      this.drawnCards.unshift(this.currentCard);
      this.socket.emit('game:emit', { type:"newCard",game:2, room_code: this.gameInfo.room_code, card: this.currentCard });

      setTimeout(() => {
        this.canDraw = true;
      }, 3000);
    } else {
      alert('No hay más cartas disponibles');
    }
  }
}
