import { Component, OnInit } from '@angular/core';
import { GithubApiService, GitHubEvent } from '../../services/github-api.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-github-activity',
  templateUrl: './github-activity.component.html',
  styleUrls: ['./github-activity.component.css']
})
export class GithubActivityComponent implements OnInit {

  /** Loading indicator for template */
  loading = true;

  /** Simple error flag – can be expanded into message later */
  error = false;

  /** Recent GitHub events (already mapped for the template) */
  events: GitHubEvent[] = [];

  /** Max number of events to display */
  private readonly EVENT_LIMIT = 5;

  constructor(private githubApi: GithubApiService) { }

  ngOnInit(): void {
    this.fetchGitHubEvents();
  }

  /**
   * Fetch activity summary from the real GitHub API service
   */
  private fetchGitHubEvents(): void {
    this.loading = true;
    this.error = false;

    this.githubApi
      .getActivitySummary()
      .pipe(
        catchError(err => {
          console.error('GitHub activity fetch failed', err);
          this.error = true;
          this.loading = false;
          return of({ events: [] }); // fall back to empty list
        })
      )
      .subscribe(summary => {
        // Convert / slice as needed for presentation
        this.events = summary.events
          .slice(0, this.EVENT_LIMIT)
          .map(evt => ({
            ...evt,
            // Pre-format date for easier display in template
            created_at: this.formatDate(evt.created_at)
          }));
        this.loading = false;
      });
  }

  /**
   * Return a short, human-readable date (e.g. “2025-08-03”)
   */
  private formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

}

