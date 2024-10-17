import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup; 
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router  
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  
      password: ['', Validators.required], 
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      // this.isLoading = true; 

      const loginData = this.loginForm.value;
      console.log("loginForm", loginData);
      
      this.userService.loginUser(loginData).subscribe({
        next: (response) => {
          // Display success message with SweetAlert
          Swal.fire({
            position: 'bottom-right',
            icon: 'success',
            title: 'Login successful!',
            showConfirmButton: false,
            timer: 2000, 
            customClass: {
              popup: 'small-swal' 
            }
          });

          // Save token to localStorage and navigate to the home page
          localStorage.setItem('token', response.token);
          this.router.navigate(['/home']);  
        },
        error: (err) => {
          console.error('Login failed:', err);

       
          Swal.fire({
            position: 'bottom-right',
            icon: 'error',
            title: 'Login failed!',
            text: 'Please check your credentials and try again.',
            showConfirmButton: false,
            timer: 2000, 
            customClass: {
              popup: 'small-swal' 
            }
          });
        },
        complete: () => {
          this.isLoading = false; 
        }
      });
    } else {
      console.log('Form is invalid');
      this.loginForm.markAllAsTouched();
    }
  }
}
