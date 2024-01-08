import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmEmail } from 'src/app/interfaces/confirmEmail';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent {
  constructor(private accountService: AccountService, private route: ActivatedRoute) {
    this.confirmEmail();
  }

  confirmEmail(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const email = this.route.snapshot.queryParamMap.get('email');

    const model = {
      token: token,
      email: email
    } as ConfirmEmail;

    this.accountService.confirmEmail(model).subscribe();
  }
}
