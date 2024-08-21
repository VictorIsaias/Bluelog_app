import { Component,Input,Output,EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { environment } from 'src/environments/environment';
import { UserHistoryComponent } from '../user-history/user-history.component';
import { GlobalHistoryComponent } from '../global-history/global-history.component';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-wait-room',
  templateUrl: './wait-room.component.html',
  styleUrls: ['./wait-room.component.scss']
})
export class WaitRoomComponent {
  @Input() players?: Array<any>;
  @Input() myInfo?:any;
  @Input() gameInfo?:any;
  @Input() status?:any;
  @Output() deleteFunc: EventEmitter<number> = new EventEmitter();
  @Output() BeginFunc: EventEmitter<void> = new EventEmitter();


  apiUrl = environment.apiUrl

  constructor(private cookieService: CookieService,private router: Router,private dialogService: NbDialogService) { }

  viewStatistics(nickname: string) {
    this.cookieService.set("history-user", nickname);
    this.dialogService.open(UserHistoryComponent);
  }

  viewStatisticsGlobal(){
    
    this.dialogService.open(GlobalHistoryComponent);

  }
  

}
