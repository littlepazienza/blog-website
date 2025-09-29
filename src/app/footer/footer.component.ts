import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  constructor(private router: Router) { }

  /**
   * Check if current route is an admin route to hide footer
   */
  isAdminRoute(): boolean {
    const currentUrl = this.router.url;
    return currentUrl.startsWith('/admin');
  }

}