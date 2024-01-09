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

  isDirty = false;
  showPassword = false;

  showPasswordChangeForm = false;
  showSignInForm = true;
  showResendEmailLink = false;
  showResendEmailForm = false;

  constructor(public accountService: AccountService, private router: Router, private toastr: ToastrService) { }

  login(): void {
    this.accountService.login(this.model).subscribe({
      next: () => this.router.navigateByUrl('/members'),
      error: error => {
        this.toastr.error(error.error)
        if (error.error === 'Email is not confirmed') {
          this.showResendEmailLink = true;
        }
      }
    })
  };

  resendConfirmationEmail(): void {
    const email = this.model.email;

    this.accountService.resendEmailConfirmationLink(email).subscribe({
      next: () => this.toastr.success("Email was sent to your adress."),
      error: error => this.toastr.error(error.error)
    })
  };

  sendEmailUsernamePassword(): void {
    const email = this.model.email;

    this.accountService.forgotUsernameOrPassword(email).subscribe({
      next: () => this.toastr.success("Email was sent to your adress."),
      error: error => this.toastr.error(error.error)
    })
  };

  toggleEmailForm(): void {
    this.showResendEmailForm = true;
    this.showPasswordChangeForm = false;
    this.showSignInForm = false;
  };

  togglePasswordForm(): void {
    this.showPasswordChangeForm = true;
    this.showResendEmailForm = false;
    this.showSignInForm = false;
  };

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  };

  onPasswordInput(): void {
    this.isDirty = true;
  };
}
