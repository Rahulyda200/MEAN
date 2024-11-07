
import {
  Component,
  OnInit,
  Inject,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  AfterViewChecked,
  ViewChild
} from '@angular/core';
import { UserService } from '../user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2'; 

interface Message {
  sender: string;
  receiver: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image'; 
  // status: 'sent' | 'delivered' | 'read'; 
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy,AfterViewChecked {
  @Input() user: any;
  @Output() chatClosed = new EventEmitter();
  @ViewChild('chatMessages') private chatMessages: any;
  isOnline: boolean = false;
  showUploadButton = true;
  messageContent: string = '';
  messages: Message[] = [];
  chatImage: string | ArrayBuffer | null = null;
  roomId: string = '';
  sender: string = '';
  receiverName: string = '';
  profileImage: string | ArrayBuffer | null = null;
  images: string | ArrayBuffer | null = null;
  selectedMessageIndex: number | null = null;
  showDeleteIcon = false;
  private messageSubscription: Subscription = new Subscription();

  constructor(
    private http: HttpClient,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: { user: any }
  ) {}

  ngOnInit() {
    this.sender = this.userService.getLoggedInUserName();
    this.receiverName = this.data.user.name;

    // this.fetchMessages();
    this.joinRoom();

    this.messageSubscription = this.userService
    .receiveMessages()
    .subscribe((message: any) => {
      console.log('Received message from server:', message);
      
      this.messages.push({
        sender: message.sender,
        receiver: message.receiver,
        content: message.content,
        timestamp: new Date(),
        // status: 'delivered',
        type: message.type || 'text'  
      });
      this.scrollToBottom();
    });
  
    this.userService.onDisconnect().subscribe(() => {
      console.log('You have been disconnected');
    });
  }

  ngOnDestroy() {
    this.messageSubscription.unsubscribe();
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  fetchMessages() {
    // this.http
      // .get<{ messages: Message[] }>('http://localhost:3000/api/messages')
      // .subscribe((response) => {
      //   this.messages = response.messages
      //     .filter(
      //       (msg) =>
      //         (msg.sender === this.sender &&
      //           msg.receiver === this.receiverName) ||
      //         (msg.sender === this.receiverName && msg.receiver === this.sender)
      //     )
      //     .map((msg) => ({
      //       sender: msg.sender,
      //       content:
      //         msg.type === 'image'
      //           ? `data:image/jpeg;base64,${msg.content}`
      //           : msg.content,
      //       receiver: msg.receiver || this.receiverName,
      //       timestamp: msg.timestamp || new Date(),
      //       // status: msg.status,
      //       type: msg.type,
      //     }));
  
      //   console.log('Fetched messages:', this.messages);
      // });
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
      timestamp: new Date(),
      status: 'sent',
      type: 'text'
    };
  
    this.userService.sendMessage(messageData).subscribe({
      next: () => {
        this.messages.push();
        this.scrollToBottom();
      },
      error: (err) => console.error('Error sending message:', err),
    });
  
    this.messageContent = '';
  }
  scrollToBottom() {
    if (this.chatMessages) {
      this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
    }
  }

  isSameDate(date1: Date, date2: Date): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  }

  closeChat(): void {
    this.chatClosed.emit();
  }

  uploadProfilePicture(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;
        this.sendProfileImageToServer(file);
      };
      reader.readAsDataURL(file);
      this.showUploadButton = false;
    }
  }

  sendProfileImageToServer(file: File) {
    const formData = new FormData();
    formData.append('profileImage', file);

    // this.http
    //   .post('http://localhost:3000/api/uploadProfileImage', formData)
    //   .subscribe({
    //     next: (response: any) => {
    //       console.log('Profile image uploaded successfully', response);
    //     },
    //     error: (err) => {
    //       console.error('Error uploading profile image', err);
    //     },
    //   });
  }

  showEmojiPicker: boolean = false;

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  appendEmoji(emoji: string) {
    this.messageContent += emoji;
  }

  initiateAudioCall() {
    console.log('Initiating audio call...');
  }

  initiateVideoCall() {
    console.log('Initiating video call...');
  }

  uploadChatImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.images = e.target.result; 
        this.sendMessageToSocket(e.target.result, 'image');
      };
      reader.readAsDataURL(file);
    }
  }
  
  
  sendMessageToSocket(content: string, type: 'text' | 'image') {
    const messageData = {
      sender: this.sender,
      receiver: this.receiverName,
      content,
      roomId: this.roomId,
      timestamp: new Date(),
      status: 'sent', 
      type
    };
  
    this.userService.sendMessage(messageData).subscribe({
      next: () => {
        this.messages.push(messageData); 
        this.scrollToBottom();
      },
      error: (err) => console.error('Error sending message:', err),
    });
  }
  
  
  
  // sendImageMessage(file: File) {
  //   const formData = new FormData();
  //   formData.append('images', file);

  //   // this.http
  //   //   .post('http://localhost:3000/api/images', formData)
  //   //   .subscribe({
  //   //     next: (response: any) => {
  //   //       console.log(' image uploaded successfully', response);
  //   //     },
  //   //     error: (err) => {
  //   //       console.error('Error uploading  image', err);
  //   //     },
  //   //   });
  // }
  onMessageDoubleClick(index: number) {
    this.selectedMessageIndex = index;
    this.showDeleteIcon = true;
  }

  // deleteSelectedMessage() {
  //   if (this.selectedMessageIndex !== null) {
  //     this.messages.splice(this.selectedMessageIndex, 1);
  //     this.selectedMessageIndex = null;
  //     this.showDeleteIcon = false;
  //   }
  // }
  deleteSelectedMessage() {
    if (this.selectedMessageIndex !== null) {
      Swal.fire({
        title: 'Delete message?',
        text: 'Are you sure you want to delete this message? ',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        backdrop: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.messages.splice(this.selectedMessageIndex!, 1); 
          Swal.fire({
            title: 'Deleted!',
            text: 'Your message has been deleted.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          });
          this.selectedMessageIndex = null; 
        } else {
          this.closeDeleteIcon();
        }
        this.showDeleteIcon = false;
      });
    } else {
      console.error('Invalid message index selected for deletion.');
    }
  }
  
  
  

  closeDeleteIcon() {
    this.selectedMessageIndex = null;
    this.showDeleteIcon = false;
  }
}
