import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private httpService: HttpService
  ) {}

  async onLogin() {
    if (!this.password.trim()) {
      this.errorMessage = 'Password is required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response = await this.httpService.post('/admin/login', { 
        password: this.password 
      }).toPromise();

      if (response.success) {
        // Store authentication token
        localStorage.setItem('admin-token', response.token);
        
        // Redirect to admin dashboard
        this.router.navigate(['/admin']);
      } else {
        this.errorMessage = response.error || 'Login failed';
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.status === 401) {
        this.errorMessage = 'Invalid password';
      } else {
        this.errorMessage = 'Login failed. Please try again.';
      }
    } finally {
      this.isLoading = false;
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onLogin();
    }
  }
}