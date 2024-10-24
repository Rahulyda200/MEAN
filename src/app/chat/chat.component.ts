import { Component, OnInit, Inject, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface Message {
  sender: string;
  receiver: string;
  content: string;
  timestamp: Date; 
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() user: any; 
  @Output() chatClosed = new EventEmitter();

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
    this.joinRoom(); 

    this.messageSubscription = this.userService.receiveMessages().subscribe((message: any) => {
      console.log('Received message from server:', message);
      this.messages.push({
        sender: message.sender,
        receiver: message.receiver,
        content: message.content,
        timestamp: new Date() 
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
      this.messages = response.messages.filter(msg => 
        (msg.sender === this.sender && msg.receiver === this.receiverName) || 
        (msg.sender === this.receiverName && msg.receiver === this.sender)
      ).map(msg => ({
        sender: msg.sender,
        content: msg.content, 
        receiver: msg.receiver || this.receiverName,
        timestamp: msg.timestamp || new Date() // Use existing timestamp or set to now
      }));
      
      console.log("Fetched messages:", this.messages);
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
      roomId: this.roomId,
      timestamp: new Date() 
    };

    console.log('Sending message:', messageData);

    this.userService.sendMessage(messageData).subscribe({
      next: () => {
        console.log('Message sent successfully');
        this.messages.push({
          sender: this.sender,
          receiver: this.receiverName,
          content: this.messageContent,
          timestamp: messageData.timestamp 
        });
      },
      error: (err: any) => {
        console.error('Error sending message:', err);
      }
    });

    this.messageContent = ''; 
  }

  isSameDate(date1: Date, date2: Date): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  }

  closeChat(): void {
    this.chatClosed.emit(); 
  }
}
