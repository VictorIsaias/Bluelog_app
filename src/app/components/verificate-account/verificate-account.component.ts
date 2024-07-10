import { Component, ElementRef, Input, OnInit, ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastRef } from '@nebular/theme';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
interface error{
  message:string
}

@Component({
  selector: 'app-verificate-account',
  templateUrl: './verificate-account.component.html',
  styleUrls: ['./verificate-account.component.scss']
})
export class VerificateAccountComponent implements OnInit{
  form:FormGroup
  hide = true
  icon = ""
  showPassword = true
  maxDigits = 5
  email = ""
  
  toasts:Array<NbToastRef> = []
  @Input() verify!: (func:Function) => void;
  @ViewChild('emailInput') emailInput!: ElementRef;

  constructor(private authService:AuthService,fb:FormBuilder,private auth:ApiService,
    private router: Router,private cookieService: CookieService){
    
    this.email = cookieService.get('email')
    this.form=fb.group({
      email: [this.email, [Validators.required, Validators.email]],
      code: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(5)]]
    })  
  }
  ngOnInit(): void {
    if(this.email!=""){
      this.sendCode()

    }
  }

  async submit(){
    let verified = await this.authService.verify()
      if(verified){
        if(this.email!=this.form.value.email){
          this.updateEmail()
        }else{
          this.verifyCode()
        }
      }else{
        this.deleteToasts()
        this.toasts.push(this.authService.showToast("Captcha invalido","danger"))
      }
  

  }

  deleteToasts(){
    this.toasts.forEach(element => {
      element.close()
    });
  }

  redirectLogin(){
    this.router.navigate(['/auth/login']);
  }

  sendCode(){
    this.auth.post({
      email:this.email 
    },"auth/send-code").subscribe(response => {
      if(response.type!="Error"){
        this.deleteToasts()
        this.authService.showToast("¡El codigo ha sido enviado a tu correo electronico!","success","Exito")
        
      }
    },
    error =>{
      this.deleteToasts()
      if(error.error.errors){
        let errores:Array<error> = error.error.errors
        errores.forEach(element => {
          this.toasts.push(this.authService.showToast(element.message,"danger"))
        
        })
      }
    })
  }

  sendAgain(){
    this.sendCode()
  }

  verifyCode(){
    this.auth.post(this.form.getRawValue(),"auth/verify-account").subscribe(response => {
      if(response.type!="Error"){
        this.cookieService.delete('email')
        this.redirectLogin()
      }
    },
    error =>{
      this.deleteToasts()
      if(error.error.errors){
        let errores:Array<error> = error.error.errors
        errores.forEach(element => {
          this.toasts.push(this.authService.showToast(element.message,"danger"))
        
        })
      }
    })
  }

  updateEmail(){
    this.auth.post({
      newEmail:this.form.value.email,
      email:this.email 
    },"auth/correct-email").subscribe(response => {
      if(response.type!="Error"){
        this.email=this.form.value.email
        this.verify(this.verifyCode)
      }
    },
    error =>{
      
      this.deleteToasts()
      if(error.error.errors){
        let errores:Array<error> = error.error.errors
        errores.forEach(element => {
          this.toasts.push(this.authService.showToast(element.message,"danger"))
        
        })
      }
    })
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

  onInput(event: Event){
    const inputElement = event.target as HTMLInputElement;
    const currentValue = inputElement.value;

    if (currentValue.length > this.maxDigits) {
      inputElement.value = currentValue.slice(0, this.maxDigits);
      return
    }
  }

}
