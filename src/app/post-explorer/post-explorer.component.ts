import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { HttpService } from '../http.service';
import { Blog } from '../blog';

@Component({
  selector: 'app-post-explorer',
  templateUrl: './post-explorer.component.html',
  styleUrls: ['./post-explorer.component.css']
})
export class PostExplorerComponent implements OnInit {

  /* ----------------------------- STATE ----------------------------- */
  /** All posts retrieved from backend/mock service */
  allPosts: Blog[] = [];

  /** Filtered result list (before pagination) */
  filteredPosts: Blog[] = [];

  /** Search term entered by the user */
  searchTerm = '';

  /** Selected category (Programming | Cooking | Planting | '') */
  selectedCategory: string = '';

  /** Current sort option */
  sortBy: 'date' | 'title' | 'category' = 'date';

  /** Loading indicator */
  loading = false;

  /* --------------------------- PAGINATION -------------------------- */
  pageSize = 10;
  currentPage = 1;
  totalPages = 1;

  constructor(
    private http: HttpService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;

    /* Grab category param if present */
    const initialCategory = this.route.snapshot.paramMap.get('story');
    if (initialCategory) {
      this.selectedCategory = initialCategory;
    }

    /* Fetch posts */
    this.http.getAllBlogs().subscribe({
      next: posts => {
        this.allPosts = posts;
        this.applyFilters();
        this.loading = false;
      },
      error: err => {
        console.error('Failed to load posts', err);
        this.loading = false;
      }
    });
  }

  /* ============================ FILTERING =========================== */

  /** Re-calculate `filteredPosts` whenever filters change */
  private applyFilters(): void {
    let result = [...this.allPosts];

    /* filter by category */
    if (this.selectedCategory) {
      result = result.filter(p => p.story === this.selectedCategory);
    }

    /* search term */
    if (this.searchTerm.trim().length) {
      const term = this.searchTerm.trim().toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.text.toLowerCase().includes(term)
      );
    }

    /* sorting */
    switch (this.sortBy) {
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'category':
        result.sort((a, b) => a.story.localeCompare(b.story));
        break;
      default: // date
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    this.filteredPosts = result;
    this.setupPagination();
  }

  /* ---------------------- Helpers triggered by UI ------------------- */
  onSearchTermChange(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.applyFilters();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange(sort: 'date' | 'title' | 'category'): void {
    this.sortBy = sort;
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.sortBy = 'date';
    this.currentPage = 1;
    this.applyFilters();
  }

  /* --------------------------- PAGINATION --------------------------- */
  private setupPagination(): void {
    this.totalPages = Math.max(Math.ceil(this.filteredPosts.length / this.pageSize), 1);
  }

  get pagedPosts(): Blog[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredPosts.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
  }

}
