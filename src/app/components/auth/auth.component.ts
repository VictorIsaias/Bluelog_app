import { Component, OnDestroy,OnInit } from '@angular/core';
import { ReCaptchaV3Service } from 'ng-recaptcha';

import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit ,OnDestroy{

  captcha = document.getElementById('grecaptcha_badge')

  constructor(){

  }

  ngOnInit(): void {
    let element = document.getElementsByClassName('grecaptcha-badge');
    element[0].setAttribute('id', 'grecaptcha_badge');
    if(this.captcha){
      this.captcha.style.display = 'block';
  
    }
  }

  ngOnDestroy() {
    let element = document.getElementsByClassName('grecaptcha-badge');
    element[0].setAttribute('id', 'grecaptcha_badge');
    if(this.captcha){
      this.captcha.style.display = 'none';
    }
  }
  

}
