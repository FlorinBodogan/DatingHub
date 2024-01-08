import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResetPassword } from 'src/app/interfaces/resetPassword';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup = new FormGroup({});
  submitted = false;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  };

  initializeForm(): void {
    this.changePasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    });

    this.changePasswordForm.controls['password'].valueChanges.subscribe({
      next: () => this.changePasswordForm.controls['confirmPassword'].updateValueAndValidity()
    });
  };

  changePassword(): void {
    if (this.changePasswordForm.invalid) {
      this.submitted = true;
      this.getErrorsMessage();
      return;
    }

    const token = this.route.snapshot.queryParamMap.get('token');
    const email = this.route.snapshot.queryParamMap.get('email');
    const newPassword = this.changePasswordForm.get('password')?.value;

    const model: ResetPassword = {
      token: token,
      email: email,
      newPassword: newPassword
    } as ResetPassword;

    this.accountService.resetPassword(model).subscribe({
      next: () => {
        this.toastr.success('You successfully changed your password');
      },
      error: error => this.toastr.error(error.error)
    })
  };

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : { notMatching: true }
    }
  };

  checkClassInvalid(param: string, submitted: boolean) {
    return this.changePasswordForm.get(param)?.errors && this.changePasswordForm.get(param)?.touched || this.changePasswordForm.get(param)?.errors && submitted ? true : false;
  };

  // -------------------- MESSAGES ERROR FUNCTIONS -------------------
  getErrorsMessage(): void {
    this.getErrorsMessagePassword();
    this.getErrorsMessageConfirmPassword();
  };

  getErrorsMessagePassword(): string {
    if (this.changePasswordForm.get('password')?.hasError('required')) {
      return 'Please enter a password.';
    } else if (this.changePasswordForm.get('password')?.hasError('minlength')) {
      return "Password it's too short.";
    } else if (this.changePasswordForm.get('password')?.hasError('maxlength')) {
      return "Password it's too long.";
    } else if (this.changePasswordForm.get('password')?.hasError('pattern')) {
      return "Password must contain at least one uppercase letter, one digit, and one special character.";
    } else return '';
  };

  getErrorsMessageConfirmPassword(): string {
    if (this.changePasswordForm.get('confirmPassword')?.hasError('required')) {
      return 'Please enter a confirmation password.';
    } else if (this.changePasswordForm.get('confirmPassword')?.hasError('matchValues')) {
      return "Passwords are not matching.";
    } else return '';
  };
}
