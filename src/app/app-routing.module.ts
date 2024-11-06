import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { EditComponent } from './edit/edit.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { AuthGuard } from './auth.guard';
import { ChatComponent } from './chat/chat.component';
import { ImojiComponent } from './imoji/imoji.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },  
  { path: 'edit/:id', component: EditComponent, canActivate: [AuthGuard] }, 
  { path: 'register', component: RegisterComponent },  
  { path: 'login', component: LoginComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'imoji', component: ImojiComponent },

  { path: '', redirectTo: '/login', pathMatch: 'full' }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule {}
