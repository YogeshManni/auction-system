import { Component, inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: any = new FormControl('', [Validators.email]);
  password: any = new FormControl('', [Validators.minLength(8)]);

  errorMessage: unknown = '';
  showServerErrorMessage = false;

  private userService = inject(UserService);
  private router = inject(Router);
  private title = inject(Title);

  constructor() {
    this.title.setTitle('Login');
  }

  login(): void {
    const email = this.email.value;
    const password = this.password.value;

    this.userService.login(email, password).subscribe(
      (_) => {
        this.router.navigate(['']).then();
      },
      (err) => {
        this.showServerErrorMessage = true;
        this.errorMessage = err.error;

        setTimeout(() => {
          this.showServerErrorMessage = false;
        }, 3000);
      }
    );
  }
}
