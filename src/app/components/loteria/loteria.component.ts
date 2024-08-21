import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbWindowService } from '@nebular/theme';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { Game } from 'src/app/models/game';
import { ApiService } from 'src/app/services/api.service';
import { GameHistoryService } from 'src/app/services/game-history.service';
import { GamesService } from 'src/app/services/games-alerts.service';
import { environment } from 'src/environments/environment';


interface Card {
  name: string;
  marked: boolean;
  number: number;
  image: string;
  type?: string;
}

@Component({
  selector: 'app-loteria',
  templateUrl: './loteria.component.html',
  styleUrls: ['./loteria.component.scss']
})
export class LoteriaComponent extends Game implements OnInit{
  @ViewChild('disabledEsc', { read: TemplateRef }) disabledEscTemplate!: TemplateRef<HTMLElement>;  

  @ViewChild('beforeMatchDuel', { read: TemplateRef }) override beforeMatchTemplateDuel!: TemplateRef<HTMLElement>;  

  @ViewChild('gameFinished', { read: TemplateRef }) override gameFinishedTemplate!: TemplateRef<HTMLElement>;  

  apiUrl = environment.apiUrl
  currentCard: Card | null = null;
  winners: any[] = [];

  constructor(private gameHistoryService: GameHistoryService,private dialog: NbDialogService,private Aroute: ActivatedRoute,private window: NbWindowService,private Wsocket: Socket,private gameService:GamesService,private cookie:CookieService,private apiService: ApiService,private routerService: Router){
    super(dialog,Aroute,window,Wsocket,gameService,cookie,apiService,routerService);
  }

  ngOnInit(): void {
    this.Wsocket.on('game:listen', async (data:any)=>{
      if(data.room_code==this.gameInfo.room_code){
        if(data.type=="endGame"){
          this.winners = data.winners;
          console.log(this.winners);
          
          this.gameHistoryService.addGame(this.winners,this.players, this.gameInfo.room_code!);
          this.finishGame()
        }
      
      }
    })

    this.Wsocket.on('room:listen', async (data:any)=>{
      if(data.room_code==this.gameInfo.room_code){
        console.log(data)
        if(this.myInfo.role=="invited"&&(data.user_code==this.myInfo.user_code||data.user_code=="general")){

          switch (data.type){
            case "responseInfo":
              this.players=data.data.players
              this.currentCard=data.data.currentCard
              this.status=data.data.status
              this.counter=data.data.counter
              console.log(this.status)
  
              this.doAction()
              break
            
          }}
          else if(this.myInfo.role=="host"){
            switch (data.type){
              case "requestInfo":
                this.sendInfoUpdate(data.user_code)
  
                break
  
              
              case "requestJoin":
                if(data.game_id==this.gameInfo.game.id){
  
                  
                  if(this.gameInfo.room_privacy=="private"&& !this.requests.find(request => request.user_code === data.user_code)) {
                    let ref = this.window.open(this.disabledEscTemplate, {
                      title: 'Solicitud para unirse a la partida',
                      context: { join: data },
                      hasBackdrop: false,
                      closeOnEsc: false,
                      buttons: {
                        minimize: false,
                        maximize: false,
                        fullScreen: false
                      },
                    });
  
                    let obj = {
                      nickname:data.nickname,
                      user_code:data.user_code,
                      window_ref:ref,
                      public:false
                    }
  
                    this.requests.push(obj)
                    
  
                  }else if(this.gameInfo.room_privacy=="public"){
                    this.acceptRequest({
                      nickname:data.nickname,
                      user_code:data.user_code,
                      public:true
                    })
                  }
                }
            
              break
            }
          }
        if(data.user_code=="general-plus"){
            this.players=data.data.players
            this.currentCard=data.data.currentCard
            this.status=data.data.status
            this.counter=data.data.counter

            this.doAction()
            
        }
      }
      })
  }

    

  override sendInfoUpdate(user_code:string){
    if(this.myInfo.role=="host"){
      this.Wsocket.emit('data:emit', {
        type:"responseGameInfo",
        user_code:user_code,
        room_code:this.gameInfo.room_code,
        data:{
          players:this.players,
          currentCard:this.currentCard,
          status:this.status,
          winners:this.winners
        }
  
      })

    }

  }
  

  finishGame(){

    this.status="game-finished"
    this.doAction()
  }

  override startGame() {
    this.winners=[]
    this.status="before-match"
    this.sendInfoUpdate("general-plus")
    this.doAction()
  }


  cards: Card[] = [
    { name: 'El Gallo', marked: false, number: 1, image: this.apiUrl+'/uploads/loteria_1_none.jpg' },
    { name: 'El Diablito', marked: false, number: 2, image: this.apiUrl+'/uploads/loteria_2_scarlet.png', type: 'scarlet' },
    { name: 'La Dama', marked: false, number: 3, image: this.apiUrl+'/uploads/loteria_3_none.jpg' },
    { name: 'El Catrín', marked: false, number: 4, image: this.apiUrl+'/uploads/loteria_4_none.jpg' },
    { name: 'El Paraguas', marked: false, number: 5, image: this.apiUrl+'/uploads/loteria_5_none.jpg' },
    { name: 'La Sirena', marked: false, number: 6, image: this.apiUrl+'/uploads/loteria_6_none.jpg' },
    { name: 'La Escalera', marked: false, number: 7, image: this.apiUrl+'/uploads/loteria_7_none.png' },
    { name: 'La Botella', marked: false, number: 8, image: this.apiUrl+'/uploads/loteria_8_none.png' },
    { name: 'El Barril', marked: false, number: 9, image: this.apiUrl+'/uploads/loteria_9_none.jpg' },
    { name: 'El Árbol', marked: false, number: 10, image: this.apiUrl+'/uploads/loteria_10_none.jpg' },
    { name: 'El Melón', marked: false, number: 11, image: this.apiUrl+'/uploads/loteria_11_none.jpg' },
    { name: 'El Valiente', marked: false, number: 12, image: this.apiUrl+'/uploads/loteria_12_none.jpg' },
    { name: 'El Gorrito', marked: false, number: 13, image: this.apiUrl+'/uploads/loteria_13_none.jpg' },
    { name: 'La Muerte', marked: false, number: 14, image: this.apiUrl+'/uploads/loteria_14_diamond.png', type: 'diamond' },
    { name: 'La Pera', marked: false, number: 15, image: this.apiUrl+'/uploads/loteria_15_none.png' },
    { name: 'La Bandera', marked: false, number: 16, image: this.apiUrl+'/uploads/loteria_16_none.jpg' },
    { name: 'El Bandolón', marked: false, number: 17, image: this.apiUrl+'/uploads/loteria_17_none.png' },
    { name: 'El Violoncello', marked: false, number: 18, image: this.apiUrl+'/uploads/loteria_18_none.png' },
    { name: 'La Garza', marked: false, number: 19, image: this.apiUrl+'/uploads/loteria_19_none.png' },
    { name: 'El Pájaro', marked: false, number: 20, image: this.apiUrl+'/uploads/loteria_20_none.jpg' },
    { name: 'La Mano', marked: false, number: 21, image: this.apiUrl+'/uploads/loteria_21_scarlet.png', type: 'scarlet' },
    { name: 'La Bota', marked: false, number: 22, image: this.apiUrl+'/uploads/loteria_22_none.jpg' },
    { name: 'La Luna', marked: false, number: 23, image: this.apiUrl+'/uploads/loteria_23_none.jpg' },
    { name: 'El Cotorro', marked: false, number: 24, image: this.apiUrl+'/uploads/loteria_24_none.png' },
    { name: 'El Borracho', marked: false, number: 25, image: this.apiUrl+'/uploads/loteria_25_none.jpg' },
    { name: 'El Negrito', marked: false, number: 26, image: this.apiUrl+'/uploads/loteria_26_none.jpg' },
    { name: 'El Corazón', marked: false, number: 27, image: this.apiUrl+'/uploads/loteria_27_none.jpg' },
    { name: 'La Sandía', marked: false, number: 28, image: this.apiUrl+'/uploads/loteria_28_none.png' },
    { name: 'El Tambor', marked: false, number: 29, image: this.apiUrl+'/uploads/loteria_29_none.jpg' },
    { name: 'El Camarón', marked: false, number: 30, image: this.apiUrl+'/uploads/loteria_30_none.jpg' },
    { name: 'Las Jaras', marked: false, number: 31, image: this.apiUrl+'/uploads/loteria_31_none.jpg' },
    { name: 'El Músico', marked: false, number: 32, image: this.apiUrl+'/uploads/loteria_32_none.jpg' },
    { name: 'La Araña', marked: false, number: 33, image: this.apiUrl+'/uploads/loteria_33_silver.png', type: 'silver' },
    { name: 'El Soldado', marked: false, number: 34, image: this.apiUrl+'/uploads/loteria_34_none.jpg' },
    { name: 'La Estrella', marked: false, number: 35, image: this.apiUrl+'/uploads/loteria_35_none.png' },
    { name: 'El Cazo', marked: false, number: 36, image: this.apiUrl+'/uploads/loteria_36_none.png' },
    { name: 'El Mundo', marked: false, number: 37, image: this.apiUrl+'/uploads/loteria_37_none.jpg' },
    { name: 'El Apache', marked: false, number: 38, image: this.apiUrl+'/uploads/loteria_38_none.jpg' },
    { name: 'El Nopal', marked: false, number: 39, image: this.apiUrl+'/uploads/loteria_39_none.png' },
    { name: 'El Alacrán', marked: false, number: 40, image: this.apiUrl+'/uploads/loteria_40_none.jpg' },
    { name: 'La Rosa', marked: false, number: 41, image: this.apiUrl+'/uploads/loteria_41_none.png' },
    { name: 'La Calavera', marked: false, number: 42, image: this.apiUrl+'/uploads/loteria_42_none.jpg' },
    { name: 'La Campana', marked: false, number: 43, image: this.apiUrl+'/uploads/loteria_43_none.png' },
    { name: 'El Cantarito', marked: false, number: 44, image: this.apiUrl+'/uploads/loteria_44_none.png' },
    { name: 'El Venado', marked: false, number: 45, image: this.apiUrl+'/uploads/loteria_45_none.jpg' },
    { name: 'El Sol', marked: false, number: 46, image: this.apiUrl+'/uploads/loteria_46_none.jpg' },
    { name: 'La Corona', marked: false, number: 47, image: this.apiUrl+'/uploads/loteria_47_none.jpg' },
    { name: 'La Chalupa', marked: false, number: 48, image: this.apiUrl+'/uploads/loteria_48_none.jpg' },
    { name: 'El Pino', marked: false, number: 49, image: this.apiUrl+'/uploads/loteria_49_none.png' },
    { name: 'El Pescado', marked: false, number: 50, image: this.apiUrl+'/uploads/loteria_50_none.jpg' },
    { name: 'La Palma', marked: false, number: 51, image: this.apiUrl+'/uploads/loteria_51_none.png' },
    { name: 'La Maceta', marked: false, number: 52, image: this.apiUrl+'/uploads/loteria_52_none.png' },
    { name: 'El Arpa', marked: false, number: 53, image: this.apiUrl+'/uploads/loteria_53_none.png' },
    { name: 'La Rana', marked: false, number: 54, image: this.apiUrl+'/uploads/loteria_54_none.png' }
  ];
}
