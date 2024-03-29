import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'src/app/services/messages/message.service';
import { TimeagoModule } from 'ngx-timeago';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { User } from 'src/app/interfaces/user';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  standalone: true,
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.scss',
  imports: [
    CommonModule,
    TimeagoModule,
    MatButtonModule,
    FormsModule,
    MatIconModule
  ]
})
export class MemberMessagesComponent implements OnInit, OnDestroy {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  @ViewChild('messageForm') messageForm?: NgForm;
  @Input() username?: string;
  @Input() user?: User;

  messageContent = '';
  lastMessage = false;
  loading = false;
  showTextarea = false;

  constructor(public messageService: MessageService) { }

  ngOnInit(): void {
    this.createHubConnection();
    this.scrollToBottom();
    this.checkScreenWidth();
  };

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenWidth();
  };

  checkScreenWidth(): void {
    const screenWidthThreshold = 990;

    this.showTextarea = window.innerWidth > screenWidthThreshold;
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  };

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  };

  createHubConnection(): void {
    if (this.user && this.username) {
      this.messageService.createHubConnection(this.user, this.username);
    }
  };

  sendMessage(): void {
    if (!this.username) return;
    this.loading = true;
    this.messageService.sendMessage(this.username, this.messageContent)?.then(() => {
      this.messageForm?.reset();
    }).finally(() => {
      this.loading = false;
    });
  };
}
