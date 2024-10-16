import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup; 
  submitted = false; 

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      // address: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {}

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      if (confirm('enter valid input fields')) 

      return; 
    }
    
    this.userService.registerUser(this.registerForm.value).subscribe(
      response => {
        // if (confirm('User registered successfully')) 
        console.log('User registered successfully', response);
        
        this.reset()
        const userId = response?.user?._id || response?.id; 
        // if (userId) {
        //   this.router.navigate(['/edit', userId]);  
        // } else {
        //   console.error('User ID is undefined in the response');
        // }
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User updated successfully!',
          showConfirmButton: false,  
          timer: 1000
        }).then(() => {

              this.router.navigate(['/home']).then((success) => {
                if (success) {
                  console.log('Redirected to home successfully');
                } else {
                  console.error('Failed to redirect to home');
                }
              });
            })
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error updating user. Please try again later!',
          confirmButtonText: 'OK'
        });
        // if (confirm('enter valid input fields')) 

        console.error('Error registering user', error);
        
      }
    );
  }
  

  reset() {
    this.registerForm.reset(); 
    this.submitted = false; 
  }
}
