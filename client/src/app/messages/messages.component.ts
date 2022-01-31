import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { Pagination } from '../models/pagination';
import { ConfirmService } from '../_services/confirm.service';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[]; 
  pagination: Pagination; 
  container = 'Unread'; 
  pageNumber = 1; 
  pageSize = 5; 
  loading = false; 

  constructor(private messageService: MessageService, private confirmService: ConfirmService) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  //Load messages with pagination
  loadMessages() {
    this.loading = true; 
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe(response => {
      this.messages = response.result; 
      this.pagination = response.pagination; 
      this.loading = false; 
    })
  }

  //when the pagination page is changed, update the results.
  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page; 
      this.loadMessages();
    }
  }

  //Delete a message.
  //Confirm service has to be subscribed to anywhere outside of the root guard. 
  deleteMessage(id: number) {
    this.confirmService.confirm('Confirm delete message?', 'This cannot be undone.').subscribe(result => {
      if (result) {
        this.messageService.deleteMessage(id).subscribe(() => {
          this.messages.splice(this.messages.findIndex(m => m.id === id), 1); 
        })
      }
    })
  }
}
