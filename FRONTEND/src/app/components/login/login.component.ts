import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  model: any = {}
  showPassword = false;

  constructor(public accountService: AccountService, private router: Router, private toastr: ToastrService) { }

  login(): void {
    this.accountService.login(this.model).subscribe({
      next: () => this.router.navigateByUrl('/members'),
      error: error => this.toastr.error(error.error)
    })
  };

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  };
}
