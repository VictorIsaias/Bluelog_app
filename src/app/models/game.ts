import { CookieService } from "ngx-cookie-service";
import { ApiService } from "../services/api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NbDialogRef, NbDialogService, NbToastRef, NbWindowRef, NbWindowService } from "@nebular/theme";
import { GamesService } from "../services/games-alerts.service";
import { Socket } from "ngx-socket-io";
import { Component, OnInit,TemplateRef  } from '@angular/core';
import { interval, Subscription } from 'rxjs';

interface message{
    username:string,
    media?:string,
    message:string,
    answer?:message,
    userPhoto:string,
    date:string
  }
  

export class Game {

    constructor(private dialogService: NbDialogService,private route: ActivatedRoute,private windowService: NbWindowService,private socket: Socket,private toastService: GamesService,private cookieService:CookieService,private api: ApiService,private router: Router){
        
      this.route.queryParamMap.subscribe(params => {
        let code = params.get('room')
        if(code){
            cookieService.delete("room_code")
            cookieService.set("room_code",code)
        }
        this.gameInfo.room_code=cookieService.get("room_code")
      })
        this.myInfo.role=cookieService.get("role")
        this.myInfo.user_code=cookieService.get("user_code")
        this.myInfo.photo=cookieService.get("photo")
        this.myInfo.nickname=cookieService.get("nickname")
        this.token=cookieService.get("token")
        this.gameInfo.room_code=cookieService.get("room_code")

        interface error{
            message:string
          }
          this.api.get("room/"+this.gameInfo.room_code,this.token).subscribe(response => {
            if(response.type!="Error"){
                this.gameInfo=response.data
                if(this.myInfo.role=="host"){
                    
                    this.api.get("user",this.token).subscribe(response => {
                        if(response.type!="Error"){
                            this.addPlayer({
                                user_code:this.myInfo.user_code!,
                                nickname:response.data.nickname,
                                photo:response.data.photo,
                                country:response.data.country,
                            })

                        }
                    })


                    this.socket.on('room:listen', async (data:any)=>{
                    
                        if(data.room_code==this.gameInfo.room_code){
                            switch (data.type){
                                case "confirmJoin":
                                    this.addPlayer(data)

                            }

                        }
                    
                    })

                    
                  }
                
                if(this.myInfo.role=="invited"){
                    this.socket.emit('data:emit', {
                        type:"requestGameInfo",
                        room_code:this.gameInfo.room_code,
                        user_code:this.myInfo.user_code
                    })
            
                }
            }
          },
          error =>{
            this.deleteToasts()
            if(error.error.message){
              this.toasts.push(this.toastService.showToast(error.error.message,"danger"))
            }
            else{
              let errores:Array<error> = error.error.errors
              errores.forEach(element => {
                this.toasts.push(this.toastService.showToast(element.message,"danger"))
                
              })
            }
          })

          

    }

    beforeMatchTemplateTournament!: TemplateRef<HTMLElement>
    matchFinishedTemplate!: TemplateRef<HTMLElement>
    gameFinishedTemplate!: TemplateRef<HTMLElement>;  
    beforeMatchTemplateDuel!: TemplateRef<HTMLElement>;  

    gameInfo:{        
        room_code?:string,
        room_privacy?:string,
        invited_players?:Array<any>,
        game?:any,
        host_player?:any,
        matches?:Array<any>} = {}
    myInfo:{        
        role?:string,
        user_code?:string,
        nickname?:string,
        photo?:string|null
    } = {}

    players:Array<any> = []
    messages:Array<message> = []
    requests:Array<{
        nickname:string,
        user_code:string,
        window_ref:NbWindowRef
    }> = []

    token=""
    
    winner: string | null = null;
    
    status="waiting-room"

    match=0

    gameMode=""

    winnerMatch: string | null = null;

    toasts:Array<NbToastRef> = []

    counter = 0

    acceptRequest(request:any){

        this.socket.emit('data:emit', {
            type:"answerJoinRoom",
            room_code:this.gameInfo.room_code,
            user_code:request.user_code,
            answer:true
        })
        if(!request.public){
            this.close()

        }
    }

    closeRequest(request:any){
        this.socket.emit('data:emit', {
            type:"answerJoinRoom",
            room_code:this.gameInfo.room_code,
            user_code:request.user_code,
            answer:false
        })
        this.close()
    }
    close(){
        
        this.requests[this.requests.length-1].window_ref.close();
        this.requests.pop()
    }

    deleteToasts(){
        this.toasts.forEach(element => {
          element.close()
        });
      }

    addPlayer(player:{user_code:string,nickname:string,photo:string|null,country:string|null}){
        if(player.photo==null){
            player.photo="generic.png"
        }
        if(player.country==null){
            player.country="Desconocido"
        }
        this.players.push({
            user_code:player.user_code,
            nickname:player.nickname,
            photo:player.photo,
            country:player.country,
            roundWins:0,
            roundLooses:0,
            gameWins:0,
            tournamentLevel:0
          })
          this.sendInfoUpdate("general")
    }

    deletePlayer(index:number){
        this.players.splice(index)
        this.sendInfoUpdate("general")
    } 

    sendInfoUpdate(user_code:string){
    }

    startGame(){

    }

    selectPlayers(){

    }

    restartGame(){

    }

    startMatch(){

    }

    countdownSubscription:Subscription|null=null
    
    doAction(){
        //eliminar jugador si ya no esta en la lista

        let activo = false
        this.players.forEach(player => {
          if(player.user_code==this.myInfo.user_code){
            activo = true
          }
        })
        if(!activo){
          this.router.navigate(['/meet/games'])
        }

        //evento: antes de una ronda
        if(this.status=="before-match"&&this.counter<=0){
            this.selectPlayers()
            let ref: NbDialogRef<any>
            switch (this.gameMode){
                case "duel":
                    ref = this.dialogService.open(this.beforeMatchTemplateDuel, {
                      hasBackdrop: true,
                      closeOnEsc: false
                    });
                    break
                case "tournament":

                    break
            }
            this.counter = 7
            this.countdownSubscription = interval(1000).subscribe(() => {
              this.counter--;
              if (this.counter <= 0) {
                this.winnerMatch = null
                ref.close()
                this.status="match-in-progress"
                this.counter=0
                
                if (this.countdownSubscription) {
                  this.countdownSubscription.unsubscribe()
                }
              }
            })
            

        }


        //evento: cuando se termina una ronda
        else if(this.status=="match-finished"&&this.counter<=0){
            let ref = this.dialogService.open(this.matchFinishedTemplate, {
              hasBackdrop: true,
              closeOnEsc: false
          });

            this.counter = 5;
            this.countdownSubscription = interval(1000).subscribe(() => {
              this.counter--;
              if (this.counter <= 0) {
                ref.close()
                if (this.countdownSubscription) {
                    this.countdownSubscription.unsubscribe();
                }
                if(this.winner!=null){
                  this.status="game-finished"
                  this.doAction()
                }else{
                  this.status="before-match"
                  this.doAction()
                }

              }
            });
        }

        else if(this.status=="game-finished"){
          let ref = this.dialogService.open(this.gameFinishedTemplate, {
            hasBackdrop: true,
            closeOnEsc: false
          });

          this.counter = 20;
          this.countdownSubscription = interval(1000).subscribe(() => {
            this.counter--;
            if (this.counter <= 0) {
              this.status="waiting-room"
              ref.close()

              if (this.countdownSubscription) {
                  this.countdownSubscription.unsubscribe();
              }


            }
          });
      }
    }
}

