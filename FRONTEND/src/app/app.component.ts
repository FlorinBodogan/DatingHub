import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account/account.service';
import { User } from './interfaces/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
      this.setCurrentUser();
  }; 

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if(!userString) return;
    const user: User = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  };
}
