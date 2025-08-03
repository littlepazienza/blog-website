import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Blog } from '../blog';

@Component({
  selector: 'app-newspaper-landing',
  templateUrl: './newspaper-landing.component.html',
  styleUrls: ['./newspaper-landing.component.css']
})
export class NewspaperLandingComponent implements OnInit {

  /** Today's date – displayed in header */
  today: Date = new Date();

  /** Featured post shown in the hero section */
  featuredPost: Blog | null = null;

  /** List of up-to-five most-recent posts (excluding featured) */
  recentPosts: Blog[] = [];

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.httpService.getAllBlogs().subscribe({
      next: (blogs: Blog[]) => {
        if (!blogs || blogs.length === 0) {
          this.featuredPost = null;
          this.recentPosts = [];
          return;
        }

        /* Sort blogs by date descending – assumes ISO-8601 strings */
        const sorted = [...blogs].sort((a, b) =>
          new Date(b.date as unknown as string).getTime() -
          new Date(a.date as unknown as string).getTime()
        );

        // Pick the most recent as featured
        this.featuredPost = sorted[0];

        // Grab the next five as recent
        this.recentPosts = sorted.slice(1, 6);
      },
      error: err => {
        console.error('Error fetching blogs:', err);
        this.featuredPost = null;
        this.recentPosts = [];
      }
    });
  }

}
