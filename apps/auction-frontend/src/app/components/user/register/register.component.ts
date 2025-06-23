import { Component, inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  email: any = new FormControl('', [Validators.email]);
  password: any = new FormControl('', [Validators.minLength(8)]);
  repeatPassword = new FormControl('', []);

  showServerErrorMessage = false;
  errorMessage: unknown = '';

  private userService = inject(UserService);
  private router = inject(Router);
  private title = inject(Title);

  constructor() {
    this.title.setTitle('Register');
  }
  register(): void {
    const email = this.email.value;
    const password = this.password.value;
    const repeatPassword = this.repeatPassword.value;

    if (password !== repeatPassword) {
      this.errorMessage = 'password should match';
      return;
    }

    this.userService.register(email, password).subscribe(
      (user) => {
        this.router.navigate(['/user/login']).then();
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
