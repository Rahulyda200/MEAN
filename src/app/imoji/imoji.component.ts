import { Component, Output, EventEmitter } from '@angular/core';

type EmojiSet = "" | "apple" | "google" | "twitter" | "facebook"; 

@Component({
  selector: 'app-imoji',
  templateUrl: './imoji.component.html',
  styleUrls: ['./imoji.component.css']
})
export class ImojiComponent {
  @Output() messageUpdated = new EventEmitter<string>();
  showEmojiPicker = false;

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    const emoji = event.emoji.native; 
    this.messageUpdated.emit(emoji);
    this.showEmojiPicker = false;
  }

}
  