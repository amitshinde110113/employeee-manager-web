import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';
import { AuthService } from 'src/app/shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormValidator } from 'src/app/shared/form-validators/form-validators';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  passLengthError = false;
  isLoginView = true;
  loginForm: FormGroup;
  signupForm: FormGroup;
  confirmPassError = false;
  user: any;
  processing: boolean;
  maxDate = new Date();
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService

  ) { }

  ngOnInit() {
    this.buildLoginForm();
    this.buildSignupForm();
  }
  buildLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', [FormValidator.isRequired(), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      password: ['', FormValidator.isRequired()]
    });


  }
  buildSignupForm() {
    this.signupForm = this.fb.group({
      firstName: ['', FormValidator.isRequired()],
      lastName: ['', FormValidator.isRequired()],
      dob: [null, FormValidator.isRequired()],
      email: ['', [FormValidator.isRequired(), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      password: ['', FormValidator.isRequired()],
      address: ['', FormValidator.isRequired()],
      company: ['', FormValidator.isRequired()],
      confirmPassword: ['', FormValidator.isRequired()]
    });
    this.signupForm.get('confirmPassword').valueChanges.subscribe(val => {
      if (this.signupForm.value.password) {
        (this.signupForm.value.password !== val) ? this.confirmPassError = true : this.confirmPassError = false;
      }
    });
    this.signupForm.get('password').valueChanges.subscribe(val => {
      if (this.signupForm.value.passworrd) {
        (this.signupForm.value.passworrd.length < 6) ? this.passLengthError = true : this.passLengthError = false;
      }
    });
  }
  login() {

    this.user = this.loginForm.value;
    this.processing = true;

    this.userService.login(this.user).subscribe((res: any) => {
      this.authService.login();
      this.loginForm.reset();
      localStorage.setItem('currenUser', JSON.stringify(res.user));
      localStorage.setItem('token', JSON.stringify(res.token));
      this.router.navigate(['employee']);
      this.toastr.success('Logged In.');
      this.processing = false;
    }, error => {
      if (error.status == 404) {
        this.toastr.error('User not found.', error.status);
      } else {
        this.toastr.error(error.error.message || 'Error while logging in', error.status);
        this.processing = false;
      }
    });
  }
  signUp() {
    if (this.signupForm.value.password !== this.signupForm.value.confirmPassword) {
      this.confirmPassError = true;
      return;
    }
    this.user = this.signupForm.value;
    this.processing = true;
    this.userService.signUp(this.user).subscribe((res) => {
      this.signupForm.reset();
      this.isLoginView = true;
      this.processing = false;

      this.toastr.success('User registered successfully.');
    }, error => {
      this.toastr.error(error.error.message || 'Error');
      this.processing = false;

    });
  }
}
