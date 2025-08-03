import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service'
import { Blog } from '../blog';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  title = 'blog-website';
  allBlogs: Blog[] = [];
  constructor(private httpService: HttpService) {}

  /*
   * Initialize the landing component, load the blog posts from the server.
   */
  ngOnInit(): void {
    this.httpService.getAllBlogs().subscribe({
      next: (blogs: Blog[]) => {
        this.allBlogs = blogs;
        console.log('Blogs loaded:', this.allBlogs);
      },
      error: (err) => {
        console.error('Failed to load blogs:', err);
      }
    });
  }

  // TODO: implement story-specific filtering using typed data model
}
