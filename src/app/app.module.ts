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
import { NbActionsModule, NbButtonGroupModule, NbContextMenuModule, NbDatepickerModule, NbDialogModule, NbFormFieldModule, NbIconModule, NbListModule, NbSelectModule, NbSpinnerModule, NbThemeModule, NbTooltipModule, NbTreeGridModule, NbWindowModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbAlertModule, NbButtonModule, NbCardModule, NbChatModule, NbInputModule, NbLayoutModule, NbMenuModule, NbToastrModule, NbUserModule } from '@nebular/theme';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { VerificateAccountComponent } from './components/verificate-account/verificate-account.component';
import { ExtraStepsComponent } from './components/extra-steps/extra-steps.component';
import { AuthService } from './services/auth.service';
import { TiktaktoeComponent } from './components/tiktaktoe/tiktaktoe.component';
import { MinichatComponent } from './components/minichat/minichat.component';
import { MeetingsComponent } from './components/meetings/meetings.component';
import { GamesService } from './services/games-alerts.service';
import { MatchmakingComponent } from './components/matchmaking/matchmaking.component';
import { WaitRoomComponent } from './components/wait-room/wait-room.component';
import { GamesComponent } from './components/games/games.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { LoteriaComponent } from './components/loteria/loteria.component';
import { LoteriaInvitedComponent } from './components/loteria-invited/loteria-invited.component';
import { LoteriaHostComponent } from './components/loteria-host/loteria-host.component';
import { CardsDialogComponent } from './components/cards-dialog/cards-dialog.component';
import { GlobalHistoryComponent } from './components/global-history/global-history.component';
import { UserHistoryComponent } from './components/user-history/user-history.component';

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
    MeetingsComponent,
    WaitRoomComponent,
    StatisticsComponent,
    LoteriaComponent,
    LoteriaInvitedComponent,
    LoteriaHostComponent,
    CardsDialogComponent,
    GlobalHistoryComponent,
    UserHistoryComponent
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
    NbDialogModule.forRoot(),
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
    NbSpinnerModule,
    NbUserModule,
    NbButtonGroupModule,
    NbTreeGridModule,
    NbListModule,
    NbActionsModule,
    NbContextMenuModule,
    NbMenuModule.forRoot(),
    NbWindowModule.forRoot(),

    NbTooltipModule
  ],
  providers: [ApiService,GamesService,AuthService,CookieService,{ provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.captchaKey }],
  bootstrap: [AppComponent]
})
export class AppModule { }

