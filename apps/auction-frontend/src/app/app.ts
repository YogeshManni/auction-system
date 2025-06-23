import { Component, HostListener, inject, OnInit } from '@angular/core';
import { UserService } from './components/user/user.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  notification: string | null = null;
  setTimeoutId: any | any = 0;
  isBackToTopActive: boolean | boolean = false;

  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @HostListener('window:scroll') onScroll(): void {
    this.isBackToTopActive = window.pageYOffset > 20;
  }

  logout() {
    this.userService.logout().subscribe(() => {
      this.router.navigate(['']).then();
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.notification = params['notification'];
      this.setTimeoutId = setTimeout(() => {
        this.notification = null;
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { notification: null },
          queryParamsHandling: 'merge',
        });
      }, 3000);
    });
  }

  scrollToTop() {
    window.scroll(0, 0);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData;
  }
}
