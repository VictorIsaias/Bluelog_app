import { Injectable } from '@angular/core';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { ApiService } from './api.service';
import { Subscription } from 'rxjs';
import {NbComponentStatus,NbGlobalLogicalPosition,NbIconConfig,NbToastRef,NbToastrService } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  subscription: Subscription | null = null;

  constructor(private auth:ApiService,private recaptchaV3Service: ReCaptchaV3Service,private toastrService: NbToastrService) { }
  
  
  logicalPositions = NbGlobalLogicalPosition;

  verify(): Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.subscription = this.recaptchaV3Service.execute('importantAction')
      .subscribe((token) => {
        if(token){
          resolve(this.verifyToken(token))
        }else{
          reject(false)
        }
      })
    })
  }
  
  
  verifyToken(token:string): Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.auth.post({token:token},"auth/verify-recaptcha").subscribe(response => {
        if(response.data=="true"){
          resolve(true)
        }
        else{
          reject(false)
        }
      })    
    })
  }

  showToast(message:string,status:NbComponentStatus,title?:string): NbToastRef {
    const iconConfig: NbIconConfig = { icon: "alert-triangle-outline", pack: 'eva' }
    return this.toastrService.show( message,title?title:"Error",{hasIcon:true,icon:iconConfig,duplicatesBehaviour:"all", position:this.logicalPositions.BOTTOM_END,duration:0,destroyByClick:true,preventDuplicates:true,status});
    
  }

}
