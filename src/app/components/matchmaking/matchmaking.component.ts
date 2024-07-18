import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbToastRef } from '@nebular/theme';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { ApiService } from 'src/app/services/api.service';
import { GamesService } from 'src/app/services/games-alerts.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.scss']
})
export class MatchmakingComponent implements OnInit{

  form:FormGroup
  userCode:string=""
  token:string=""
  privacy=""
  gameId=""
  isRequesting: boolean = false;
  countdown: number = 60;
  toasts:Array<NbToastRef> = []
  countdownSubscription: Subscription | undefined;
  listener: Function
  response:any
  active:boolean=true

  constructor(private toastService: GamesService,private api:ApiService,fb:FormBuilder,private cookieService:CookieService, protected dialogRef: NbDialogRef<MatchmakingComponent>, private socket: Socket) {
    this.form=fb.group({
      roomCode: ['', [Validators.required]],
    })  

    this.listener = async (data: { type: string, room_code: string, user_code: string ,answer:boolean}) => {
          
      if(data.type=="responseJoin"&&data.user_code==this.userCode&&this.active==true){
        this.closeSpinner();

        if(data.answer==true){
          this.toastService.showToast("Se ha encontrado partida, redireccionando...","success","Solicitud aceptada")
          this.socket.emit('data:emit', {
            type:"confirmJoinRoom",
            room_code:data.room_code,
            user_code:this.userCode,
            nickname:this.response.data.nickname,
            photo:this.response.data.photo,
            country:this.response.data.country
          })
          this.join(data.room_code)
        }else if(data.answer==false){
          this.toastService.showToast("Haz sido rechazado","danger","Solicitud rechazada")
        }

      }else if(data.type=="cancelJoin"&&data.user_code==this.userCode){
        this.active=false
        this.closeSpinner()
      }
    }
  }
  ngOnInit(): void {

    this.userCode=this.cookieService.get("user_code")
    this.token=this.cookieService.get("token")
    this.privacy=this.cookieService.get("privacy")
    this.gameId=this.cookieService.get("game")
    if(this.privacy=="public"){
      this.requestPublic()
    }
  }

  async requestPublic(){
    this.api.get("user",this.token).subscribe(response => {
      if(response.type!="Error"){
            
        this.socket.emit('data:emit', {
          type:"requestJoinRoom",
          privacy:"public",
          game_id:this.gameId,
          user_code:this.userCode,
          nickname:response.data.nickname
        })

        this.startCountdown()
        this.response=response
        this.active=true

        this.socket.on('room:listen', this.listener)
      }
    })

  }

  async request(){
    this.api.get("user",this.token).subscribe(response => {
      if(response.type!="Error"){
        let nickname = response.data.nickname
        let roomCode = this.form.value.roomCode
        let id = parseInt(this.gameId)+1     

        this.socket.emit('data:emit', {
          type:"requestJoinRoom",
          privacy:"private",
          room_code:roomCode,
          user_code:this.userCode,
          nickname:nickname,
          game_id:id
        })
        this.startCountdown();
        this.response=response
        this.active=true
        this.socket.on('room:listen', this.listener)

      }
    })

  }

  startCountdown() {
    this.isRequesting = true;
    this.countdown = 60;
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.cancelRequest();
      }
    });
  }

  cancelRequest() {
    if (this.isRequesting) {
      this.socket.emit('data:emit', {
        type: "cancelJoinRoom",
        room_code: this.form.value.roomCode,
        user_code: this.userCode
      });
      this.closeSpinner();
      if(this.privacy=="public"){
        this.close()
      }
    }
  }

  closeSpinner() {
    this.isRequesting = false;
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  join(roomCode:string) {
    interface error{
      message:string
    }
    this.api.post({},"room/join/"+roomCode,this.token).subscribe(response => {
      if(response.type!="Error"){
        this.dialogRef.close(roomCode)
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

  
  deleteToasts(){
    this.toasts.forEach(element => {
      element.close()
    });
  }
  close() {
    this.dialogRef.close();
  }
}
