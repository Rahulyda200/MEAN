import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  UpdateForm: FormGroup;
  userId: string | undefined;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.UpdateForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: this.formBuilder.array([]),
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
      if (this.userId) {
        this.loadUserData(this.userId);
      } else {
        console.error('User ID is undefined');
      }
    });
  }

  loadUserData(userId: string) {
    this.userService.getUserById(userId).subscribe(
      (user) => {
        this.UpdateForm.patchValue(user);
        if (user.address && user.address.length) {
          const addressControl = this.UpdateForm.get('address') as FormArray;
          user.address.forEach((address: string) => {
            addressControl.push(this.formBuilder.control(address));
          });
        } else {
          console.warn('No addresses found for the user');
        }
      },
      (error) => {
        console.error('Error fetching user data', error);
      }
    );
  }

  get address(): FormArray {
    return this.UpdateForm.get('address') as FormArray;
  }

  addMores() {
    this.address.push(this.formBuilder.control(''));
    console.log('Current address ', this.address.value);
  }

  removeAddress(index: number) {
    this.address.removeAt(index);
    console.log('Removed address at index:', index, 'Current address array:', this.address.value);
  }

  onUpdate() {
    if (this.userId) {
      this.loading = true;
      const formValues = this.UpdateForm.value;

      formValues.address = formValues.address
        .map((address: string) => address.trim())
        .filter((address: string) => address.length > 0);

      this.userService.updateUser(this.userId, formValues).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'User updated successfully!',
            showConfirmButton: false,  
            timer: 1000
          }).then(() => {
         
            this.router.navigate(['/home'], { queryParams: { page: this.route.snapshot.queryParams['page'] } });
            // this.router.navigate(['/home'])
          });

          this.loading = false;
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error updating user. Please try again later!',
            confirmButtonText: 'OK'
          });

          console.error('Error updating user', error);
          this.loading = false;
        }
      );
    }
  }

  cancle(){
    this.router.navigate(['/home'])
  }
}
