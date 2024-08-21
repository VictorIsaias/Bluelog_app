import { Component, OnInit,TemplateRef, ViewChild  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbWindowRef, NbWindowService } from '@nebular/theme';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { Game } from 'src/app/models/game';
import { ApiService } from 'src/app/services/api.service';
import { GamesService } from 'src/app/services/games-alerts.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tiktaktoe',
  templateUrl: './tiktaktoe.component.html',
  styleUrls: ['./tiktaktoe.component.scss']
})
export class TiktaktoeComponent extends Game implements OnInit{
  board: Array<string> = Array(9).fill('');

  limitDuel = 3
  currentPlayer: string = 'X';
  playerX = {
    player:"X",
    user_code:"",
    nickname:"",
    photo:""
  }
  playerO = {
    player:"O",
    user_code:"",
    nickname:"",
    photo:""
  }
  
  apiUrl = environment.apiUrl
  
  @ViewChild('disabledEsc', { read: TemplateRef }) disabledEscTemplate!: TemplateRef<HTMLElement>;  

  @ViewChild('beforeMatchDuel', { read: TemplateRef }) override beforeMatchTemplateDuel!: TemplateRef<HTMLElement>;  

  @ViewChild('matchFinished', { read: TemplateRef }) override matchFinishedTemplate!: TemplateRef<HTMLElement>;  

  @ViewChild('beforeMatchTournament', { read: TemplateRef }) override beforeMatchTemplateTournament!: TemplateRef<HTMLElement>;  

  @ViewChild('gameFinished', { read: TemplateRef }) override gameFinishedTemplate!: TemplateRef<HTMLElement>;  


  constructor(private dialog: NbDialogService,private Aroute: ActivatedRoute,private window: NbWindowService,private Wsocket: Socket,private gameService:GamesService,private cookie:CookieService,private apiService: ApiService,private routerService: Router){
    super(dialog,Aroute,window,Wsocket,gameService,cookie,apiService,routerService);
  }
  ngOnInit(): void {
    this.Wsocket.on('game:listen', async (data:any)=>{
      if(data.room_code==this.gameInfo.room_code){
        if(data.type=="move"){
          this.board=data.board
        }
      }
    })

    this.Wsocket.on('room:listen', async (data:any)=>{
      if(data.room_code==this.gameInfo.room_code){
        if(data.user_code=="general-plus"){
            this.players=data.data.players
            this.messages=data.data.messages
            this.currentPlayer=data.data.currentPlayer
            this.board=data.data.board
            this.status=data.data.status
            this.winner=data.data.winner
            this.playerO=data.data.playerO
            this.playerX=data.data.playerX
            this.match=data.data.match
            this.gameMode=data.data.gameMode
            this.winnerMatch=data.data.winnerMatch
            this.counter=data.data.counter

            this.doAction()
            
        }
        if(this.myInfo.role=="invited"&&(data.user_code==this.myInfo.user_code||data.user_code=="general")){
          //escuchar respuesta para recuperar informacion de juego
          switch (data.type){
            case "responseInfo":
              this.players=data.data.players
              this.messages=data.data.messages
              this.currentPlayer=data.data.currentPlayer
              this.board=data.data.board
              this.status=data.data.status
              this.winner=data.data.winner
              this.playerO=data.data.playerO
              this.playerX=data.data.playerX
              this.match=data.data.match
              this.gameMode=data.data.gameMode
              this.winnerMatch=data.data.winnerMatch
              this.counter=data.data.counter

              this.doAction()
              break
            
          }


        }else if(this.myInfo.role=="host"){
          switch (data.type){
          //escuchar solicitud para recuperar informacion de juego
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
      }  
    })
    
  }

  cellClicked(index: number) {
    if((this.myInfo.user_code==this.playerO.user_code&&this.currentPlayer==this.playerO.player)||(this.myInfo.user_code==this.playerX.user_code&&this.currentPlayer==this.playerX.player)){
      if (!this.board[index] && !this.winnerMatch) {
        this.board[index] = this.currentPlayer;
        const res = this.checkWinner(this.board)
        if(res!=null){
          this.winnerMatch = res
          let winsX=0
          let winsO=0
          let playerX=0
          let playerO=0

          for (let index = 0; index < this.players.length; index++) {
            let player = this.players[index]
            if(player.user_code==this.playerX.user_code){
              if(this.playerX.player==this.winnerMatch){
                player.roundWins++
                player.tournamentLevel++
              }
              else if(this.playerO.player==this.winnerMatch){
                player.roundLooses++
              }
                winsX=player.roundWins
                playerX=index
            }
            if(player.user_code==this.playerO.user_code){
              if(this.playerO.player==this.winnerMatch){
                player.roundWins++
                player.tournamentLevel++
              }
              else if(this.playerX.player==this.winnerMatch){
                player.roundLooses++
              }
              winsO=player.roundWins
              playerO=index
            }
            
          }
          if(this.gameMode=="duel"&&this.match>=this.limitDuel){
            if(winsO<winsX){
              this.winner="X"
              this.players[playerX].gameWins++
            }
            if(winsO>winsX){
              this.winner="O"
              this.players[playerO].gameWins++
            }
          }
          this.finishGame()
        }
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
      }
      
      this.Wsocket.emit('data:emit', {
        type:"responseGameInfo",
        user_code:"general-plus",
        room_code:this.gameInfo.room_code,
        data:{
          players:this.players,
          messages:this.messages,
          currentPlayer:this.currentPlayer,
          board:this.board,
          status:this.status,
          winner:this.winner,
          playerO:this.playerO,
          playerX:this.playerX,
          match:this.match,
          gameMode:this.gameMode,
          winnerMatch:this.winnerMatch,
          counter:this.counter
        }
  
      })

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
      if(!this.checkWinner(tempBoardX)&&!this.checkWinner(tempBoardO)){
        return "Empate"
      }

    }
    return null
  }

  finishGame(){
    this.match++
    this.status="match-finished"
    this.board = Array(9).fill('')
    

  }

  override restartGame() {
    this.winner= null;
    this.match=0
    this.gameMode=""
    this.winnerMatch = null;
  }
  

  override sendInfoUpdate(user_code:string){
    if(this.myInfo.role=="host"){
      this.Wsocket.emit('data:emit', {
        type:"responseGameInfo",
        user_code:user_code,
        room_code:this.gameInfo.room_code,
        data:{
          players:this.players,
          messages:this.messages,
          currentPlayer:this.currentPlayer,
          board:this.board,
          status:this.status,
          winner:this.winner,
          playerO:this.playerO,
          playerX:this.playerX,
          match:this.match,
          gameMode:this.gameMode,
          winnerMatch:this.winnerMatch,
          counter:this.counter
        }
  
      })

    }

  }

  override startGame() {
    this.match=1
    this.winner=null
    this.status="before-match"
    if(this.players.length==2){
      this.gameMode="duel"
    }else{
      this.gameMode="tournament"
    }
    this.sendInfoUpdate("general-plus")
  }

  
  override selectPlayers(){
    if(this.gameMode=="duel"){
      this.playerO=this.players[0]
      this.playerX=this.players[1]
      this.playerO.player="O"
      this.playerX.player="X"
    }else{

    }
  }

}