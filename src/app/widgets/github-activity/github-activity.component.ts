import { Component, OnInit } from '@angular/core';

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

  /** Recent GitHub events */
  events: GitHubEvent[] = [];

  /** Max number of events to display */
  private readonly EVENT_LIMIT = 5;

  constructor() { }

  ngOnInit(): void {
    this.fetchGitHubEvents();
  }

  /**
   * Simulate an async call to GitHub’s Events API.
   * Replace with real HTTP integration later.
   */
  private fetchGitHubEvents(): void {
    // Begin loading
    this.loading = true;
    this.error = false;

    // Simulate latency
    setTimeout(() => {
      try {
        // --- MOCK DATA (shape aligns with public GitHub Event payload subset) ---
        this.events = [
          {
            type: 'PushEvent',
            repo: { name: 'littlepazienza/blog-website' },
            created_at: new Date().toISOString()
          },
          {
            type: 'WatchEvent',
            repo: { name: 'littlepazienza/awesome-rust' },
            created_at: new Date(Date.now() - 86400000).toISOString() // yesterday
          },
          {
            type: 'PullRequestEvent',
            repo: { name: 'littlepazienza/cool-project' },
            created_at: new Date(Date.now() - 2 * 86400000).toISOString()
          }
        ].slice(0, this.EVENT_LIMIT);
      } catch (e) {
        console.error('Mock GitHub fetch failed', e);
        this.error = true;
      } finally {
        this.loading = false;
      }
    }, 1000);
  }

}

/**
 * Minimal subset of fields used by template.
 * Extend as needed when integrating the real GitHub API.
 */
interface GitHubEvent {
  type: string;
  repo: { name: string };
  created_at: string;
}

