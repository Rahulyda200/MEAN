import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent {
  loginForm: FormGroup; 
  

  constructor(
    private fb: FormBuilder,
  ) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  
      password: ['', Validators.required], 
    });
  }

  
  onLogin() {
    console.log("loginForm",    this.loginForm.value )
   
}
}
