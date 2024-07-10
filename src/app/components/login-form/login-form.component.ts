import { Component, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/services/api.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { AuthService } from 'src/app/services/auth.service';
import { NbToastRef } from '@nebular/theme';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent{
  form:FormGroup
  hide = true;
  icon = ""
  showPassword = true;
  toasts:Array<NbToastRef> = []
  @ViewChild('inputInput') inputInput!: ElementRef;

  constructor(fb:FormBuilder,private auth:ApiService,
    private router: Router,private cookieService: CookieService,
    private authService: AuthService){
      
    this.form=fb.group({
      input: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })  
  }

  async submit(){
    let verified = await this.authService.verify()
      if(verified){
        this.login()
      }else{
        this.deleteToasts()
        this.toasts.push(this.authService.showToast("Captcha invalido","danger"))
      }
  }
  redirect(){
    this.router.navigate(['/auth/signup']);
  }
  
  redirectDashboard(){
    this.router.navigate(['/dashboard']);
  }
  
  redirectExtra(){
    this.router.navigate(['/auth/extra-steps']);
  }
  
  redirectVerify(){
    this.router.navigate(['/auth/verify-account']);
  }

  login(){
    interface error{
      message:string
    }
    this.auth.post(this.form.getRawValue(),"auth/login").subscribe(response => {
      if(response.type!="Error"){
        this.cookieService.set('token', response.token.token);
        if(response.data.phone==null&&response.data.age==null&&response.data.photo==null&&response.data.country==null){
          this.redirectExtra()
        }else{
          this.redirectDashboard()
        }
      }
    },
    error =>{
      this.deleteToasts()
      if(error.status==401){
        this.redirectVerify()
      }
      if(error.error.message){
        this.toasts.push(this.authService.showToast(error.error.message,"danger"))
      }
      else{
        let errores:Array<error> = error.error.errors
        errores.forEach(element => {
          this.toasts.push(this.authService.showToast(element.message,"danger"))
          
        })
      }
    })
  }

  deleteToasts(){
    this.toasts.forEach(element => {
      element.close()
    });
  }

  getInputType() {
    if (this.showPassword) {
      return 'password';
    }
      return 'text';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  onKeyPress(event: KeyboardEvent, nextInput?: HTMLInputElement) {
    if (event.key === 'Enter' && nextInput) {
      event.preventDefault();
      nextInput.focus();
    } else if (event.key === 'Enter' && !nextInput) {
      event.preventDefault();
      if (this.form.valid) {
        this.submit();
      }
    }
  }

}
