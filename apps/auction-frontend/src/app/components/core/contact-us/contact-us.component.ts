import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent {
  get email() {
    const user = this.userService.user;
    return user ? user.email : '';
  }
  private userService = inject(UserService);
  private router = inject(Router);

  submitForm() {
    this.router.navigate(['/'], {
      queryParams: { notification: 'Your message has been sent.' },
    });
  }
}
