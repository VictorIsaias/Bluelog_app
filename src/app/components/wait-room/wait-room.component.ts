import { Component,Input,Output,EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

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


  viewStatistics(userIndex: number) {
    console.log('Ver estadísticas para:', userIndex)
  }

}
