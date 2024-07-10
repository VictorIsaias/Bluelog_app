import { Component, ElementRef, Input, ViewChild,HostBinding  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastRef } from '@nebular/theme';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
  
})

export class RegisterFormComponent{
  form:FormGroup
  hide = true;
  icon = ""
  showPassword = true;
  toasts:Array<NbToastRef> = []
  @ViewChild('nicknameInput') nicknameInput!: ElementRef;
  @Input() verify!: (func:Function) => void;

  @HostBinding('class')
  classes = 'example-items-rows'


  constructor(private authService: AuthService,fb:FormBuilder,private auth:ApiService,private router: Router,private cookieService: CookieService){
    this.form=fb.group({
      nickname:['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validator: this.passwordMatchValidator
    })
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }

  async submit(){
    let verified = await this.authService.verify()
      if(verified){
        this.register()
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



  redirect(){
    this.router.navigate(['auth/login']);
  }

  
  redirectVerify(){
    this.router.navigate(['auth/verify-account']);
  }

  register() {
    interface error{
      message:string
    }
    this.auth.post(this.form.getRawValue(),"user").subscribe(response => {
      if(response.type!="Error"){
        this.cookieService.set('email',this.form.value.email)
        this.redirectVerify()
      }
    },
    error =>{
      this.deleteToasts()
      if(error.error.errors){
        let errores:Array<error> = error.error.errors
        errores.forEach(element => {
          this.toasts.push(this.authService.showToast(element.message,"danger"))
        
        });
      }
    })
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
