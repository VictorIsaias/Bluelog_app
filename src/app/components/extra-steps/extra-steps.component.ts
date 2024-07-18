import { Component, ElementRef, Input, ViewChild,HostBinding, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDateService, NbToastRef } from '@nebular/theme';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

interface country{
  alpha2:string,
  countryCallingCodes: Array<string>,
  name:string
}

@Component({
  selector: 'app-extra-steps',
  templateUrl: './extra-steps.component.html',
  styleUrls: ['./extra-steps.component.scss']
})
export class ExtraStepsComponent implements OnInit {
  form:FormGroup
  hide = true
  toasts:Array<NbToastRef> = []
  min: Date
  max: Date
  selectedCountry = ''
  selectedPhone = ''
  countries :Array<country> =[]
  codes:Array<string>=[]
  token=""
  @ViewChild('nicknameInput') nicknameInput!: ElementRef
  @Input() verify!: (func:Function) => void
  @HostBinding('class')
  classes = 'example-items-rows'

  constructor(protected dateService: NbDateService<Date>,private authService: AuthService,fb:FormBuilder,private auth:ApiService,private router: Router,private cookieService: CookieService){
    this.form=fb.group({
      name:['', [ Validators.minLength(2)]],
      lastname:['', [ Validators.minLength(2)]],
      phone:['', [ Validators.maxLength(10),Validators.minLength(10),Validators.pattern('^[0-9]*$')]],
      birthdate:['', [ Validators.minLength(2)]],
      country:[''],
      photo:[''],
      phone_code:[''],
    })
    this.min = this.dateService.addYear(this.dateService.today(), -100);
    this.max = this.dateService.addYear(this.dateService.today(), 0);
  }
  ngOnInit(): void {
    this.token = this.cookieService.get('token')
    this.auth.get("countries").subscribe(response => {
      if(response.type!="Error"){
        let countries: Array<country> = response.data
        countries.forEach(element => {
          this.countries.push(element)
          element.countryCallingCodes.forEach(code => {
            this.codes.push("("+element.alpha2+") "+code)
          });
        });
      }
    })
  }

  triggerFileInput() {
    const fileInput = document.getElementById('photo') as HTMLInputElement;
    fileInput.click();
  }
  photo:string=""

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.convertToBase64(file)
    }
  }

  convertToBase64(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.form.patchValue({
        photo: reader.result as string
      }) 
    };
    reader.onerror = (error) => {
      console.error('Error: ', error);
       
    };
  }

  async submit(){
    let verified = await this.authService.verify()
      if(verified){
        this.update()
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
    this.router.navigate(['meet/games']);
  }

  update() {
    interface error{
      message:string
    }
    let form_final = this.form.value
    console.log(form_final)
    console.log(this.form.value)
    form_final.phone = this.form.value.phone_code+this.form.value.phone
    this.auth.put(form_final,"user",this.token).subscribe(response => {
      if(response.type!="Error"){
        this.redirect()
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

