import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { EditComponent } from './edit/edit.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { AuthGuard } from './auth.guard'; // Import the AuthGuard
import { ChatComponent } from './chat/chat.component';
import { Chat1Component } from './chat1/chat1.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },  // Protect home route
  { path: 'edit/:id', component: EditComponent, canActivate: [AuthGuard] },  // Protect edit route
  { path: 'register', component: RegisterComponent },  
  { path: 'login', component: LoginComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'chat1', component: Chat1Component },

  { path: '', redirectTo: '/login', pathMatch: 'full' }  // Redirect to login by default
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule {}
