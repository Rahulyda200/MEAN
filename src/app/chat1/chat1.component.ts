import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service'; // Import the UserService
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat1',
  templateUrl: './chat1.component.html',
  styleUrls: ['./chat1.component.css'],
})
export class Chat1Component implements OnInit, OnDestroy {
  messageContent: string = '';
  messages: Array<{ sender: string; message: string }> = [];
  userId: string = '';
  receiverId: string = ''; 
  private messageSubscription: Subscription = new Subscription(); // For cleaning up subscriptions

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Get the current logged-in user's ID
    this.userId = this.userService.getLoggedInUserName();
    
    
    this.setReceiver('');

    // Join the chat room (user's specific room)
    this.userService.joinChatRoom(this.userId);

    // Listen for new messages
    this.messageSubscription = this.userService.receiveMessages().subscribe((message: any) => {
      this.messages.push(message); 
    });
  }

  sendMessage(): void {
    if (!this.messageContent.trim()) return; 

    const messageData = {
      sender: this.userId,
      receiverId: this.receiverId,
      message: this.messageContent,
    };

    this.userService.sendMessage(messageData).subscribe({
      next: () => {
        this.messages.push({ sender: this.userId, message: this.messageContent }); 
        this.messageContent = ''; 
      },
      error: (err) => {
        console.error('Message failed to send', err);
      },
    });
  }

  // Set the receiver dynamically
  setReceiver(receiver: string) {
    this.receiverId = receiver; // Set to either 'rishu' or 'rahul', depending on your logic
    console.log(`Receiver set to: ${this.receiverId}`);
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    this.messageSubscription.unsubscribe();
  }
}
