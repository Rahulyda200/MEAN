import { Component, OnInit, Inject, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface Message {
  sender: string;
  receiver: string;
  content: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() user: any; 
  @Output() chatClosed = new EventEmitter<void>();

  messageContent: string = '';
  messages: Message[] = []; 
  roomId: string = '';
  sender: string = ''; 
  receiverName: string = '';
  private messageSubscription: Subscription = new Subscription();

  constructor(
    private http: HttpClient, 
    private userService: UserService, 
    @Inject(MAT_DIALOG_DATA) public data: { user: any }
  ) {}

  ngOnInit() {
    this.sender = this.userService.getLoggedInUserName(); 
    this.receiverName = this.data.user.name; 

    this.fetchMessages();

    // Join the chat room
    this.joinRoom();

    // Subscribe to incoming messages
    this.messageSubscription = this.userService.receiveMessages().subscribe((message: any) => {
      console.log('Received message from server:', message);
  
      // Push the received message to the chat window
      this.messages.push({
        sender: message.sender,
        receiver: message.receiver,
        content: message.content
      });
    });
    this.userService.onDisconnect().subscribe(() => {
      console.log('You have been disconnected');
    });
  }

  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
  }

  fetchMessages() {
    this.http.get<{ messages: Message[] }>('http://localhost:3000/api/messages').subscribe(response => {
      this.messages = response.messages
      
        .filter(msg => 
            (msg.sender === this.sender && msg.receiver === this.receiverName) || 
            (msg.sender === this.receiverName && msg.receiver === this.sender)
        )
        .map(msg => ({
            sender: msg.sender,
            content: msg.content, 
            receiver: msg.receiver || this.receiverName,
        }));
        
        console.log("fetch all messages",this.messages)
    });

  }

  joinRoom() {
    this.roomId = this.data.user._id;  
    this.userService.joinChatRoom(this.roomId);  
  }
  sendMessage() {
    if (!this.messageContent.trim()) return;
  
    const messageData = {
      sender: this.sender,
      receiver: this.receiverName,
      content: this.messageContent,
      roomId: this.roomId
    };
  
    console.log('Sending message:', messageData);
  
    // Send the message to the server via the userService
    this.userService.sendMessage(messageData).subscribe({
      next: () => {
        console.log('Message sent successfully');
      },
      error: (err: any) => {
        console.error('Error sending message:', err);
      }
    });
  
    // Clear the message input field
    this.messageContent = '';
  }
  
  
  
  closeChat(): void {
    this.chatClosed.emit(); 
  }
}
