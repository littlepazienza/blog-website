import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private httpService: HttpService
  ) {}

  async canActivate(): Promise<boolean> {
    // Check if admin token exists
    const token = localStorage.getItem('admin-token');
    
    if (!token) {
      this.router.navigate(['/admin/login']);
      return false;
    }

    try {
      // Verify token with backend
      const response = await this.httpService.post('/admin/verify', { 
        token: token 
      }).toPromise();

      if (response.success && response.authenticated) {
        return true;
      } else {
        // Invalid token, remove it and redirect
        localStorage.removeItem('admin-token');
        this.router.navigate(['/admin/login']);
        return false;
      }
    } catch (error) {
      console.error('Auth verification failed:', error);
      // If verification fails, redirect to login
      localStorage.removeItem('admin-token');
      this.router.navigate(['/admin/login']);
      return false;
    }
  }

  // Helper method to check if user is authenticated without navigation
  async isAuthenticated(): Promise<boolean> {
    const token = localStorage.getItem('admin-token');
    
    if (!token) {
      return false;
    }

    try {
      const response = await this.httpService.post('/admin/verify', { 
        token: token 
      }).toPromise();

      return response.success && response.authenticated;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  }

  // Helper method for logout
  logout(): void {
    localStorage.removeItem('admin-token');
    this.router.navigate(['/admin/login']);
  }
}