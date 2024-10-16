import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { EditComponent } from './edit/edit.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },  
  { path: 'edit/:id', component: EditComponent }, 
  { path: 'register', component: RegisterComponent },  
  { path: 'login', component: LoginComponent },
  // { path: '', redirectTo: '/home', pathMatch: 'full' }  
];

  


;

@NgModule({
  imports: [RouterModule.forRoot(routes),HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
