import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';
import { AuthGuardService } from '../services/auth-guard.service';

interface BlogPost {
  _id: string;
  title: string;
  text: string;
  story: string;
  date: string;
  tags: string[];
  files: string[];
}

@Component({
  selector: 'app-admin-manage',
  templateUrl: './admin-manage.component.html',
  styleUrls: ['./admin-manage.component.css']
})
export class AdminManageComponent implements OnInit {
  blogs: BlogPost[] = [];
  isLoading = true;
  errorMessage = '';
  selectedBlog: BlogPost | null = null;
  showDeleteModal = false;
  blogToDelete: BlogPost | null = null;
  isDeleting = false;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private authGuard: AuthGuardService
  ) {}

  async ngOnInit() {
    await this.loadBlogs();
  }

  async loadBlogs() {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      const response = await this.httpService.get('/admin/blogs').toPromise();
      
      if (response.success) {
        this.blogs = response.blogs;
      } else {
        this.errorMessage = 'Failed to load blog posts';
      }
    } catch (error: any) {
      console.error('Error loading blogs:', error);
      if (error.status === 401) {
        this.authGuard.logout();
      } else {
        this.errorMessage = 'Failed to load blog posts. Please try again.';
      }
    } finally {
      this.isLoading = false;
    }
  }

  editBlog(blog: BlogPost) {
    // Navigate to editor with blog ID for editing
    this.router.navigate(['/admin/editor'], { 
      queryParams: { 
        id: blog._id,
        mode: 'edit' 
      } 
    });
  }

  confirmDelete(blog: BlogPost) {
    this.blogToDelete = blog;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.blogToDelete = null;
    this.showDeleteModal = false;
  }

  async deleteBlog() {
    if (!this.blogToDelete) return;
    
    this.isDeleting = true;
    
    try {
      const response = await this.httpService.delete(`/admin/blogs/${this.blogToDelete._id}`).toPromise();
      
      if (response.success) {
        // Remove from local array
        this.blogs = this.blogs.filter(blog => blog._id !== this.blogToDelete!._id);
        this.showDeleteModal = false;
        this.blogToDelete = null;
      } else {
        this.errorMessage = response.error || 'Failed to delete blog post';
      }
    } catch (error: any) {
      console.error('Error deleting blog:', error);
      if (error.status === 401) {
        this.authGuard.logout();
      } else {
        this.errorMessage = 'Failed to delete blog post. Please try again.';
      }
    } finally {
      this.isDeleting = false;
    }
  }

  createNewBlog() {
    this.router.navigate(['/admin/editor']);
  }

  logout() {
    this.authGuard.logout();
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  }

  getStoryTypeColor(story: string): string {
    const colors: { [key: string]: string } = {
      'tech': '#007bff',
      'personal': '#28a745', 
      'tutorial': '#ffc107',
      'review': '#dc3545',
      'news': '#17a2b8'
    };
    return colors[story.toLowerCase()] || '#6c757d';
  }

  truncateText(text: string, maxLength: number = 100): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
}