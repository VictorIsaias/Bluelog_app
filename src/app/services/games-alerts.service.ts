import { Injectable } from '@angular/core';
import { NbComponentStatus, NbGlobalLogicalPosition, NbIconConfig, NbToastRef, NbToastrService } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  constructor(private toastrService: NbToastrService) { 
  }
  
  logicalPositions = NbGlobalLogicalPosition


  showToast(message:string,status:NbComponentStatus,title?:string): NbToastRef {
    const iconConfig: NbIconConfig = { icon: "alert-triangle-outline", pack: 'eva' }
    return this.toastrService.show( message,title?title:"Ganador",{hasIcon:true,icon:iconConfig,duplicatesBehaviour:"all", position:this.logicalPositions.BOTTOM_END,duration:0,destroyByClick:true,preventDuplicates:true,status});
    
  }
}
