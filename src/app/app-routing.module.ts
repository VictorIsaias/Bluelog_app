import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthComponent } from './components/auth/auth.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { VerificateAccountComponent } from './components/verificate-account/verificate-account.component';
import { ExtraStepsComponent } from './components/extra-steps/extra-steps.component';
import { MeetingsComponent } from './components/meetings/meetings.component';
import { TiktaktoeComponent } from './components/tiktaktoe/tiktaktoe.component';
import { GamesComponent } from './components/games/games.component';
import { LoteriaComponent } from './components/loteria/loteria.component';
import { GlobalHistoryComponent } from './components/global-history/global-history.component';
import { UserHistoryComponent } from './components/user-history/user-history.component';

const routes: Routes = [
  {path:"auth", component:AuthComponent,canActivate:[],children:[
    {path:"signup", component:RegisterFormComponent,canActivate:[]},
    {path:"login", component:LoginFormComponent,canActivate:[]},
    {path:"verify-account", component:VerificateAccountComponent,canActivate:[]},
    {path:"extra-steps", component:ExtraStepsComponent,canActivate:[AuthGuard]},
  ]},
  {path:"meet", component:MeetingsComponent,canActivate:[AuthGuard],children:[
    {path:"games", component:GamesComponent,canActivate:[],children:[
      {path:"tiktaktoe", component:TiktaktoeComponent,canActivate:[],children:[
        {path:"history", component:GlobalHistoryComponent,canActivate:[],children:[]}
      ]},
      {path:"loteria", component:LoteriaComponent,canActivate:[],children:[
        {path:"history", component:GlobalHistoryComponent,canActivate:[],children:[]},
        {path:"user-history/:nickname", component:UserHistoryComponent,canActivate:[],children:[]}
      ]}
    ]},
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
