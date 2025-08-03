import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { HttpService } from '../../http.service';
import { Blog } from '../../blog';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {

  /** Currently-displayed blog post */
  post: Blog | null = null;

  /** True while data is being fetched */
  loading = false;

  /** Set when the requested post was not found */
  notFound = false;

  /** Posts from the same category (story) */
  relatedPosts: Blog[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpService,
    private title: Title,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    /* --------------------------------------------------------------
     * Subscribe to route params so navigating between posts re-runs
     * the data-fetch logic without re-instantiating the component.
     * -------------------------------------------------------------- */
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchPost(id);
      }
    });
  }

  /** -------------------------------------------------------------
   * Fetch a single post by ID and update component state
   * ------------------------------------------------------------- */
  private fetchPost(id: string): void {
    this.loading  = true;
    this.notFound = false;

    /* NOTE: HttpService currently exposes `getAllBlogs()`. Until a
     * dedicated “get by id” endpoint exists we fetch the list and
     * locate the post client-side.
     */
    this.http.getAllBlogs().subscribe({
      next: blogs => {
        const found = blogs.find(b => b.id === id);
        if (!found) {
          this.notFound = true;
          this.post     = null;
          this.loading  = false;
          return;
        }

        this.post    = found;
        this.loading = false;

        /* Update SEO meta tags */
        this.updateSeo(found);

        /* Load up to 3 related posts from the same category */
        this.relatedPosts = blogs
          .filter(b => b.story === found.story && b.id !== found.id)
          .slice(0, 3);
      },
      error: err => {
        console.error('Failed to fetch post:', err);
        this.notFound = true;
        this.loading  = false;
      }
    });
  }

  /** -------------------------------------------------------------
   * Navigate to the previous/next post in the list
   * ------------------------------------------------------------- */
  gotoPost(id: string): void {
    this.router.navigate(['/post', id]);
  }

  /** -------------------------------------------------------------
   * Share the current post via Web Share API (fallback: copy URL)
   * ------------------------------------------------------------- */
  share(): void {
    if (!this.post) {
      return;
    }

    const shareData = {
      title: this.post.title,
      text: this.post.text?.substring(0, 120) + '…',
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(err => {
        console.warn('Share failed', err);
      });
    } else {
      navigator.clipboard.writeText(shareData.url).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  }

  /** -------------------------------------------------------------
   * Update document title and meta description
   * ------------------------------------------------------------- */
  private updateSeo(blog: Blog): void {
    this.title.setTitle(`${blog.title} | Ben Pazienza Blog`);
    this.meta.updateTag({
      name: 'description',
      content: blog.text?.substring(0, 155) || blog.title
    });
  }

  /** -------------------------------------------------------------
   * Open image in a larger view (could expand to lightbox later)
   * ------------------------------------------------------------- */
  openImage(imageUrl: string): void {
    window.open(imageUrl, '_blank');
  }

}
