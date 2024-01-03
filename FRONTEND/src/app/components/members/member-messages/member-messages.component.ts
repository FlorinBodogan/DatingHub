import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from 'src/app/interfaces/message';
import { MessageService } from 'src/app/services/messages/message.service';
import { TimeagoModule } from 'ngx-timeago';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.scss',
  imports: [
    CommonModule,
    TimeagoModule,
    MatButtonModule,
    FormsModule
  ]
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm?: NgForm;
  @Input() username?: string;
  messages: Message[] = [];
  messageContent = '';

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadMessages();
  };

  loadMessages(): void {
    if (this.username) {
      this.messageService.getMessageThread(this.username).subscribe({
        next: messages => this.messages = messages
      })
    }
  };

  sendMessage(): void {
    if (!this.username) return;
    this.messageService.sendMessage(this.username, this.messageContent).subscribe({
      next: message => {
        this.messages.push(message);
        this.messageForm?.reset();
      }
    })
  };
}
