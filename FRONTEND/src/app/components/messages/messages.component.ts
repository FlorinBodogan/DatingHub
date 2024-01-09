import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Message } from 'src/app/interfaces/message';
import { Pagination } from 'src/app/interfaces/pagination';
import { MessageService } from 'src/app/services/messages/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  container = 'Unread';
  pageNumber = 1;
  pageSize: number = 5;
  currentTabIndex = 0;
  totalDataLength = 0;

  //tables
  dataSource = new MatTableDataSource<Message[]>([]);
  displayedColumns: string[] = ['content', 'senderUsername', 'messageSent', 'actions'];
  backgroundColorHeader = '#3333339c';
  backgroundColorRow = '#222';

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadMessages();
  };

  loadMessages(): void {
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe({
      next: response => {
        this.dataSource.data = response.result;
        this.totalDataLength = response.totalLength;
      },
      error: error => {
        console.error("Error:", error);
      }
    });
  }


  deleteMessage(id: number): void {
    this.messageService.deleteMessage(id).subscribe({
      next: () => this.loadMessages()
    })
  };

  onSelectedIndexChange(tabIndex: number): void {
    this.currentTabIndex = tabIndex;
    if (this.currentTabIndex === 0) {
      this.dataSource.data = [];
      this.container = 'Unread';
      this.resetVariables();
      this.loadMessages();
    } else if (this.currentTabIndex === 1) {
      this.dataSource.data = [];
      this.container = 'Inbox';
      this.resetVariables();
      this.loadMessages();
    } else if (this.currentTabIndex === 2) {
      this.dataSource.data = [];
      this.container = 'Outbox';
      this.resetVariables();
      this.loadMessages();
    }
  };

  resetVariables(): void {
    this.pageNumber = 1;
    this.pageSize = 5;
  }

  changePagePaginator(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadMessages();
  };
}
