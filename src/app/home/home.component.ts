import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from '../user.service'; 
import { Router, ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { EditComponent } from '../edit/edit.component';
import { User } from '../../user.model';
import { ChatComponent } from '../chat/chat.component';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] 
})
export class HomeComponent implements OnInit {

  users: any[] = [];          
  filteredUsers: any[] = [];  
  displayedColumns: string[] = ['name', 'email', 'phone', 'address', 'actions'];
  currentPage = 0;
  totalUsers = 0; 
  limit = 5;
  sortBy = 'name';
  sortOrder = 'asc';
  filter = '';
  selectedUser: User | null = null;
  // dialog: any;

  constructor(
    private userService: UserService, 
    private router: Router ,  
    private route: ActivatedRoute,
    private dialog: MatDialog
  )
     {}
  // ngOnInit() {
  //   this.route.queryParams.subscribe(params => {
  //     const page = +params['page'] || 1; 
  //     this.currentPage = page - 1;
  //     this.fetchUsers(this.currentPage + 1);
  //   });
  // }
  ngOnInit() {
    this.route.queryParams.subscribe((params: { page?: number }) => {
  
      if (params.page) {
        console.log("params",params.page)
        this.currentPage = params.page - 1; 
      }
    
      this.fetchUsers(this.currentPage + 1); 
    });
  }
  

  // fetchUsers(page: number) {
  //   this.userService.getUsers(page, this.limit, this.sortBy, this.sortOrder, this.filter).subscribe(
  //     (data) => {
  //       this.users = data.users;   
  //       // this.filteredUsers = [...this.users];
  //       this.currentPage = data.currentPage - 1; 
  //       this.totalUsers = data.totalUsers; 
  //     },
  //     (error) => {
  //       console.error('Error fetching users', error);
  //     }
  //   );
  // }
  fetchUsers(page: number) {
    this.userService.getUsers(page, this.limit, this.sortBy, this.sortOrder, this.filter).subscribe(
      (data) => {
        this.users = data.users;
        this.currentPage = data.currentPage - 1;
        this.totalUsers = data.totalUsers;
      },
      (error) => {
        if (error.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Unauthorized',
            text: 'Please log in again.',
          });
          // Redirect to login or handle accordingly
        } else {
          console.error('Error fetching users', error);
        }
      }
    );
  }
  

  changePage(event: PageEvent) {
    this.currentPage = event.pageIndex; 
    this.limit = event.pageSize;
    this.fetchUsers(this.currentPage + 1); 
    this.router.navigate([], { queryParams: { page: this.currentPage + 1 } }); 
  }

  changeSorting(column: string) {
    this.sortBy = column;
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.fetchUsers(this.currentPage + 1);
  }

  // applyFilter(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   const filterValue = inputElement.value.trim().toLowerCase();
  //   this.filter = filterValue; 
  //   this.filteredUsers = this.users.filter(user =>
  //     user.name.toLowerCase().includes(filterValue) ||
  //     user.email.toLowerCase().includes(filterValue) ||
  //     user.phone.toLowerCase().includes(filterValue) 
  //     // (user.address && user.address.some((addr: string) => addr.toLowerCase().includes(filterValue)))
  //   );
  // }
  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.filter = inputElement.value.trim().toLowerCase();
    
    // this.currentPage = 0;  
    this.fetchUsers(1);
  }
//   applyFilter(event: Event) {
//     const inputElement = event.target as HTMLInputElement;
//     this.filter = inputElement.value.trim().toLowerCase();
    
//     // Filter users based on input
//     this.filteredUsers = this.users.filter(user =>
//         user.name.toLowerCase().includes(this.filter) ||
//         user.email.toLowerCase().includes(this.filter) ||
//         user.phone.toLowerCase().includes(this.filter) 
//     );

//     this.currentPage = 0;  // Optionally reset page index on filter
//     // You might not need to call fetchUsers here unless you want to refresh the entire user list
// }

  
  
  editUser(userId: string) {
    // const dialogRef = this.dialog.open(EditComponent, {
    //   data: { user: userId },
    //   width: '400px',
    // });
    this.router.navigate(['/edit', userId], { queryParams: { page: this.currentPage + 1 } });
  }


  // editUser(userId: string) {
  //   this.router.navigate(['/edit', userId]);
  // }
  
  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User updated successfully!',
        showConfirmButton: false,  
        timer: 1000
      })
      this.userService.deleteUser(userId).subscribe(
        () => {
          console.log('User deleted successfully');
          this.fetchUsers(this.currentPage + 1); 
        },

        (error) => {
          console.error('Error deleting user', error);
        }
      );
      
    }
  }
  // openChat(user: User) {
  //   this.selectedUser = user; 
    
 
  // }

  openChat(user: User) {
    Swal.fire({
      position: 'bottom-right',
      icon: 'success',
      title: `${user.name} has joined their room.`,
      showConfirmButton: false,
      timer: 1000,
      customClass: {
        popup: 'small-swal',
      },
    }).then(() => {
      const dialogRef = this.dialog.open(ChatComponent, {
        data: { user: user },
        width: '500px',
      });
  
      dialogRef.afterClosed().subscribe(() => {
        console.log('Chat dialog closed');
      });
    });
  }
  
  

  
  // dialogRef.afterClosed().subscribe(() => {
  //   // Handle any actions after the dialog is closed, if needed
  // });


closeChat() {
  this.selectedUser = null; 
}
}