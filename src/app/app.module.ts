import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { CookieService } from 'ngx-cookie-service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './components/auth/auth.component';
import { NbDatepickerModule, NbDialogModule, NbFormFieldModule, NbIconModule, NbSelectModule, NbThemeModule, NbTreeGridModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbAlertModule, NbButtonModule, NbCardModule, NbChatModule, NbInputModule, NbLayoutModule, NbMenuModule, NbToastrModule, NbUserModule } from '@nebular/theme';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { VerificateAccountComponent } from './components/verificate-account/verificate-account.component';
import { ExtraStepsComponent } from './components/extra-steps/extra-steps.component';
import { AuthService } from './services/auth.service';
import { GamesComponent } from './components/games/games.component';
import { TiktaktoeComponent } from './components/tiktaktoe/tiktaktoe.component';
import { MatchmakingComponent } from './components/matchmaking/matchmaking.component';
import { MinichatComponent } from './components/minichat/minichat.component';
import { MeetingsComponent } from './components/meetings/meetings.component';
import { GamesService } from './services/games-alerts.service';

const config: SocketIoConfig = { url: environment.apiUrl, options: {
  transports:['websocket']
} };

@NgModule({
  declarations: [
    AppComponent,
    RegisterFormComponent,
    LoginFormComponent,
    AuthComponent,
    VerificateAccountComponent,
    ExtraStepsComponent,
    GamesComponent,
    TiktaktoeComponent,
    MatchmakingComponent,
    MinichatComponent,
    MeetingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientJsonpModule,
    HttpClientModule,
    ReactiveFormsModule,
    RecaptchaV3Module,
    SocketIoModule.forRoot(config),
    NbThemeModule.forRoot({ name: 'dark' }),
    NbEvaIconsModule,
    NbLayoutModule,
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbToastrModule.forRoot(),
    NbMenuModule,
    NbChatModule,
    NbAlertModule,
    NbUserModule,
    NbIconModule,
    NbFormFieldModule,
    NbToastrModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbAlertModule,
    NbSelectModule,
    NbUserModule,
    NbDialogModule,
    NbTreeGridModule
  ],
  providers: [ApiService,GamesService,AuthService,CookieService,{ provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.captchaKey }],
  bootstrap: [AppComponent]
})
export class AppModule { }

