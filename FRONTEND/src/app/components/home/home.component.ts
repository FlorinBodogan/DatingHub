import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user?: User | null;

  constructor(private accountService: AccountService) {
    this.accountService.currentUser$.subscribe({
      next: user => this.user = user
    })
  }

  ngOnInit(): void {

  };
}
