import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{
  @Output() cancelRegister = new EventEmitter();

  registerForm: FormGroup = new FormGroup({});
  submitted = false;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private router: Router,
    private toastr:ToastrService
  ) { }

  ngOnInit(): void {
      this.initializeForm();
  };

  initializeForm(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      gender: ['', [Validators.required]],
      knownAs: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    });

    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    });
  };

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {notMatching: true}
    }
  };

  checkClassInvalid(param: string, submitted: boolean) {
    return this.registerForm.get(param)?.errors && this.registerForm.get(param)?.touched || this.registerForm.get(param)?.errors && submitted ? true: false;
  };

  register() {
    if (this.registerForm.invalid) {
      this.submitted = true;
      this.getErrorsMessage();
      return;
    }
    const newUser = {
      ...this.registerForm.value
    }

    this.accountService.register(newUser).subscribe({
      next: () => {
        this.router.navigateByUrl('/members');
        this.toastr.success('You successfully registered');
      },
      error: error => console.log(error)
    })
  };

  cancel() {
    this.cancelRegister.emit(false);
  };

  // -------------------- MESSAGES ERROR FUNCTIONS -------------------
  getErrorsMessage(): void {
    this.getErrorsMessageUsername();
    this.getErrorsMessageGender();
    this.getErrorsMessageDateOfBirth();
    this.getErrorsMessageKnownAs();
    this.getErrorsMessageCity();
    this.getErrorsMessageCountry();
    this.getErrorsMessagePassword();
    this.getErrorsMessageConfirmPassword();
  };

  getErrorsMessageUsername(): string {
    if (this.registerForm.get('username')?.hasError('required')) {
      return 'Please enter an username.';
    } else if (this.registerForm.get('username')?.hasError('minlength')) {
      return "Username it's too short.";
    } else if (this.registerForm.get('username')?.hasError('maxlength')) {
      return "Username it's too long.";
    } else return '';
  };

  getErrorsMessageGender(): string {
    if (this.registerForm.get('gender')?.hasError('required')) {
      return 'Please select a gender.';
    } else return '';
  };

  getErrorsMessageDateOfBirth(): string {
    if (this.registerForm.get('dateOfBirth')?.hasError('required')) {
      return 'Please select a date of birth.';
    } else return '';
  };

  getErrorsMessageKnownAs(): string {
    if (this.registerForm.get('knownAs')?.hasError('required')) {
      return 'Please enter a known as name.';
    } else return '';
  };

  getErrorsMessageCity(): string {
    if (this.registerForm.get('city')?.hasError('required')) {
      return 'Please select a city.';
    } else return '';
  };

  getErrorsMessageCountry(): string {
    if (this.registerForm.get('country')?.hasError('required')) {
      return 'Please select a country.';
    } else return '';
  };

  getErrorsMessagePassword(): string {
    if (this.registerForm.get('password')?.hasError('required')) {
      return 'Please enter a password.';
    } else if (this.registerForm.get('password')?.hasError('minlength')) {
      return "Password it's too short.";
    } else if (this.registerForm.get('password')?.hasError('maxlength')) {
      return "Password it's too long.";
    } else return '';
  };

  getErrorsMessageConfirmPassword(): string {
    if (this.registerForm.get('confirmPassword')?.hasError('required')) {
      return 'Please enter a confirmation password.';
    } else if (this.registerForm.get('confirmPassword')?.hasError('matchValues')) {
      return "Passwords are not matching.";
    } else return '';
  };
}
