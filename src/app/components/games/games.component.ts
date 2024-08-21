import { Component,Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NbDialogService,NbPosition, NbAdjustment, NbMenuService ,NB_WINDOW, NbToastRef} from '@nebular/theme';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { MatchmakingComponent } from '../matchmaking/matchmaking.component';
import { filter, map } from 'rxjs/operators';
import { GamesService } from 'src/app/services/games-alerts.service';
import { GlobalHistoryComponent } from '../global-history/global-history.component';

interface gameInterface {
  name?:string,
  description?:string,
  rules?:string,
  image?:string,
  id?:number
}

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit{
  privacy = ["public"];
  apiUrl = environment.apiUrl
  listMode = false
  descriptionMode = false
  gamesWindow = true
  token = ""
  toasts:Array<NbToastRef> = []

  nbContextMenuPlacement: NbPosition = NbPosition.BOTTOM;
  nbContextMenuAdjustment: NbAdjustment = NbAdjustment.COUNTERCLOCKWISE;
  games: Array<gameInterface> = []
  gameIndex:string | null = null
  game:gameInterface = {
    name:"",
    description:"",
    rules:"",
    image:"",
    id:0
  }
  
  constructor(private toastService: GamesService,private nbMenuService: NbMenuService,private router: Router,private api: ApiService ,private route: ActivatedRoute,private cd: ChangeDetectorRef,private dialogService: NbDialogService, private cookieService: CookieService) {}
  
  ngOnInit(): void {
    this.token=this.cookieService.get("token")
    console.log(this.route.children.length)
    if(this.route.children.length==0){

      this.route.queryParamMap.subscribe(params => {
        this.gameIndex = params.get('game');
        this.api.get("games",this.token).subscribe(response =>{
          if(response.type!="Error"){
            this.games=response.data
    
            this.game = this.games[parseInt(this.gameIndex!)]
    
          }
        })
        if(this.gameIndex==null){
          this.listMode=true
          this.descriptionMode=false
        }else if(this.gameIndex!=null){
          this.listMode=false
          this.descriptionMode=true
          
          this.cookieService.delete("game")
          this.cookieService.set("game",this.gameIndex)

        }
      })
      }
    

    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'menu'),
        map(({ item: { title } }) => title),
      )
      .subscribe(title => this.joinGame(title));
  

  }

  selectGame(gameIndex:number){
    this.router.navigate(['/meet/games'],{ 
      queryParams: { 
        game: gameIndex
      } 
    })
  }

  privacyOptions = [
    { title: 'Privada', icon: 'lock-outline', value: "private" },
    { title: 'Pública', icon: 'unlock-outline', velue: "public"}
  ]

  
  quit(){
    this.router.navigate(['/meet/games'])
  }

  deleteToasts(){
    this.toasts.forEach(element => {
      element.close()
    });
  }

  createGame(){
    interface error{
      message:string
    }
    this.api.post({
      invited_players:[],
      room_privacy:"private",
      game:this.game.id
    },"room/",this.token).subscribe(response => {
      if(response.type!="Error"){
        this.cookieService.delete("room_code")
        this.cookieService.delete("role")
        this.cookieService.delete("privacy")
        this.cookieService.set("room_code",response.data.room_code)
        this.cookieService.set("role","host")
        this.cookieService.set("privacy",response.data.room_privacy)
        var code = ""
        for (let i = 0; i < 10; i++) {
          code += Math.floor(Math.random() * 10).toString()
        }
        this.cookieService.delete("user_code")
        this.cookieService.set("user_code",code)
        this.listMode=false
        this.descriptionMode=false
        this.gamesWindow=false
        console.log(this)
        switch (this.game.id){
          case 1:      
            this.router.navigate(['/meet/games/tiktaktoe'],{ 
              queryParams: { 
                room: response.data.room_code
              } 
            })
            break;
          case 2:
            this.router.navigate(['/meet/games/loteria'],{ 
              queryParams: { 
                room: response.data.room_code
              } 
            })
            break;
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

  setSelectedGame(game: gameInterface) {
    this.game = game;
    this.cookieService.delete("game")
    this.cookieService.set("game",this.game.id!.toString())
  }

  joinGame(privacy?:string){
    var code = ""
    for (let i = 0; i < 10; i++) {
      code += Math.floor(Math.random() * 10).toString()
    }
    this.cookieService.delete("user_code")
    this.cookieService.set("user_code",code)
    if(privacy){

      this.cookieService.delete("privacy")
      this.cookieService.set("privacy",privacy)
    }
    this.dialogService.open(MatchmakingComponent)
      .onClose.subscribe(roomCode => {
        if (roomCode) {
          
        this.cookieService.delete("room_code")
        this.cookieService.delete("role")
          this.cookieService.set("room_code",roomCode)
          this.cookieService.set("role","invited")
          
          this.listMode=false
          this.descriptionMode=false
          this.gamesWindow=false
          if(this.game.id==1){
            this.router.navigate(['/meet/games/tiktaktoe'],{ 
              queryParams: { 
                room: roomCode
              } 
            })
          }
          else if(this.game.id==2){
            this.router.navigate(['/meet/games/loteria'],{ 
              queryParams: { 
                room: roomCode
              } 
            })
          }
        }
      })
  }
  
  viewStatistics(gameId: number) {
    console.log('Ver estadísticas para:', gameId)
    this.dialogService.open(GlobalHistoryComponent);

  }


}