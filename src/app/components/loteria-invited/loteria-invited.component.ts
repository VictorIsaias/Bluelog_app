import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
interface Card {
  name: string;
  marked: boolean;
  number: number;
  image: string;
  type?: string;
}

@Component({
  selector: 'app-loteria-invited',
  templateUrl: './loteria-invited.component.html',
  styleUrls: ['./loteria-invited.component.scss']
})
export class LoteriaInvitedComponent {
  @Input() myCards: Card[] = [];
  @Input() myInfo: any;
  @Input() gameInfo: any;
  @Input() players: any;
  @Input() status: string = "";
  @Input() winners: any[] = [];
  @Input() currentCard: Card | null = null;  
  @ViewChild('completeButton', { read: TemplateRef }) disabledEscTemplate!: TemplateRef<HTMLElement>;  

  myTable: Card[] = this.myCards;

  completedTable: boolean = false;

  constructor(private socket: Socket) {}

  ngOnInit() {

    this.socket.on('game:listen', async (data:any)=>{
      if(data.room_code==this.gameInfo.room_code){
        if(data.type=="newCard"){
          this.currentCard = data.card;
        }
      }
    })
    this.myTable = [...this.myCards]
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);
  }
  
  checkCard(cardName: string) {
    const card = this.myTable.find(c => c.name === cardName);
    if (card && card.name == this.currentCard!.name) {
      card.marked = true;
      
      this.completedTable = true
      for (let i = 0; i < this.myTable.length; i++) {
        if (!this.myTable[i].marked) {
          this.completedTable = false;
          break;
        }
      }
    }
  }
  completeGame(){
    if(this.completedTable){
      this.socket.emit('game:emit', { type:"winner",game:2, room_code: this.gameInfo.room_code, winner: this.myInfo });
    }
  }
}
