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
    this.loadBlogs();
  }

  /**
   * Manually flip the HttpService from mock data ➜ real backend and
   * immediately refresh the landing-page content.  Useful once the
   * Docker/Rust backend starts running.
   */
  testBackendConnection(): void {
    console.info('[NewspaperLanding] Switching to real backend …');
    this.httpService.switchToRealBackend();
    this.loadBlogs();
  }

  /**
   * Fetch posts (mock or real depending on HttpService state) and populate
   * the featured & recent sections.
   */
  private loadBlogs(): void {
    /* --------------------------------------------------------------
     * DEBUG: Mark the beginning of the data-fetch cycle
     * -------------------------------------------------------------- */
    console.info(
      '[NewspaperLanding] loadBlogs(): fetching articles – using mock =',
      (this.httpService as any).USE_MOCK_DATA ?? 'unknown'
    );

    this.httpService.getAllBlogs().subscribe({
      next: (blogs: Blog[]) => {
        /* ----------------------------------------------------------
         * DEBUG: Log raw payload received from the backend
         * ---------------------------------------------------------- */
        console.groupCollapsed(
          `[NewspaperLanding] Received ${blogs?.length ?? 0} blog posts`
        );
        console.debug(blogs);
        console.groupEnd();

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
        /* ----------------------------------------------------------
         * DEBUG: Log any HTTP / parsing errors
         * ---------------------------------------------------------- */
        console.error('[NewspaperLanding] Error fetching blogs:', err);
        this.featuredPost = null;
        this.recentPosts = [];
      }
    });
  }

}
