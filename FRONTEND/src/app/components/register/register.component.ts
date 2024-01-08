import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormControl, FormGroup, NgControl, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { RegisterUser } from 'src/app/interfaces/registerUser';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, ControlValueAccessor {
  @Input() maxDate: Date | undefined;
  bsConfig: Partial<BsDatepickerConfig> | undefined;

  registerForm: FormGroup = new FormGroup({});
  submitted = false;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.bsConfig = {
      containerClass: 'theme-red',
      dateInputFormat: 'DD MMMM YYYY'
    }
  }

  ngOnInit(): void {
    this.initializeForm();
  };

  writeValue(obj: any): void { }
  registerOnChange(fn: any): void { }
  registerOnTouched(fn: any): void { }
  setDisabledState?(isDisabled: boolean): void { }

  initializeForm(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern(/^[a-z][a-z0-9_-]{2,14}$/)]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      knownAs: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required, this.ageValidator]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    });

    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    });
  };

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : { notMatching: true }
    }
  };

  checkClassInvalid(param: string, submitted: boolean) {
    return this.registerForm.get(param)?.errors && this.registerForm.get(param)?.touched || this.registerForm.get(param)?.errors && submitted ? true : false;
  };

  register(): void {
    if (this.registerForm.invalid) {
      this.submitted = true;
      this.getErrorsMessage();
      return;
    }

    const dob = this.GetDateOnly(this.registerForm.controls['dateOfBirth'].value)

    const newUser = {
      ...this.registerForm.value,
      dateOfBirth: this.GetDateOnly(dob)
    } as RegisterUser;

    this.accountService.register(newUser).subscribe({
      next: () => {
        this.toastr.success("Account created succesfully. Now you need to confirm the email adress. A link was sent");
      },
      error: (err) => {
        this.toastr.error("Something unexpected went wrong. Please try again later.")
        console.log(err)
      }
    });

  };

  private GetDateOnly(dob: string | undefined) {
    if (!dob) return;
    let theDob = new Date(dob);
    return new Date(theDob.setMinutes(theDob.getMinutes() - theDob.getTimezoneOffset())).toISOString().slice(0, 10);
  }

  ageValidator(control: any) {
    const birthDate = new Date(control.value);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();

    if (age < 18) {
      return { invalidAge: true };
    }

    return null;
  }

  // -------------------- MESSAGES ERROR FUNCTIONS -------------------
  getErrorsMessage(): void {
    this.getErrorsMessageUsername();
    this.getErrorsMessageEmail();
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
    } else if (this.registerForm.get('username')?.hasError('pattern')) {
      return "Username must start with a lowercase letter.";
    } else return '';
  };

  getErrorsMessageEmail(): string {
    if (this.registerForm.get('email')?.hasError('required')) {
      return 'Please enter an email.';
    } else if (this.registerForm.get('email')?.hasError('email')) {
      return "This is not a valid email.";
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
    } else if (this.registerForm.get('dateOfBirth')?.hasError('invalidAge')) {
      return "You must be at least 18 years old.";
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
    } else if (this.registerForm.get('password')?.hasError('pattern')) {
      return "Password must contain at least one uppercase letter, one digit, and one special character.";
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
