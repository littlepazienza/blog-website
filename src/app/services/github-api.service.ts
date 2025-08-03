import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of, forkJoin } from 'rxjs';
import { catchError, retry, map, switchMap, tap } from 'rxjs/operators';

/**
 * GitHub API base URL and endpoints
 */
const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_USERNAME = 'littlepazienza';
const USER_EVENTS_ENDPOINT = `${GITHUB_API_URL}/users/${GITHUB_USERNAME}/events`;
const USER_REPOS_ENDPOINT = `${GITHUB_API_URL}/users/${GITHUB_USERNAME}/repos`;
const REPO_COMMITS_ENDPOINT = (repo: string) => 
  `${GITHUB_API_URL}/repos/${GITHUB_USERNAME}/${repo}/commits`;
const COMMIT_ENDPOINT = (repo: string, sha: string) => 
  `${GITHUB_API_URL}/repos/${GITHUB_USERNAME}/${repo}/commits/${sha}`;

/**
 * GitHub API response interfaces
 */
export interface GitHubActor {
  id: number;
  login: string;
  display_login: string;
  gravatar_id: string;
  url: string;
  avatar_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
    url: string;
  };
  html_url: string;
  author: GitHubActor;
  committer: GitHubActor;
}

export interface GitHubCommitDetail extends GitHubCommit {
  files: Array<{
    filename: string;
    additions: number;
    deletions: number;
    changes: number;
    status: string;
    raw_url: string;
    blob_url: string;
    patch?: string;
  }>;
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: GitHubActor;
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: {
    action?: string;
    ref?: string;
    ref_type?: string;
    master_branch?: string;
    description?: string;
    pusher_type?: string;
    push_id?: number;
    size?: number;
    distinct_size?: number;
    commits?: Array<{
      sha: string;
      author: {
        email: string;
        name: string;
      };
      message: string;
      distinct: boolean;
      url: string;
    }>;
    forkee?: any;
    release?: any;
    issue?: any;
    comment?: any;
    pull_request?: any;
  };
  public: boolean;
  created_at: string;
}

export interface CodeSnippet {
  filename: string;
  language: string;
  code: string;
  repo: string;
  commitMessage: string;
  commitUrl: string;
  commitDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class GithubApiService {
  private headers = new HttpHeaders({
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'pazienza-blog-app'
  });

  constructor(private http: HttpClient) { }

  /**
   * Get recent GitHub activity events for the user
   * @param perPage Number of events to retrieve (default: 10)
   * @returns Observable of GitHub events
   */
  getUserEvents(perPage: number = 10): Observable<GitHubEvent[]> {
    return this.http.get<GitHubEvent[]>(`${USER_EVENTS_ENDPOINT}?per_page=${perPage}`, {
      headers: this.headers
    }).pipe(
      retry(2),
      catchError(this.handleError),
      tap(events => console.log(`Fetched ${events.length} GitHub events`))
    );
  }

  /**
   * Get user repositories sorted by last updated
   * @param perPage Number of repos to retrieve (default: 10)
   * @returns Observable of GitHub repositories
   */
  getUserRepos(perPage: number = 10): Observable<GitHubRepo[]> {
    return this.http.get<GitHubRepo[]>(
      `${USER_REPOS_ENDPOINT}?sort=updated&direction=desc&per_page=${perPage}`,
      { headers: this.headers }
    ).pipe(
      retry(2),
      catchError(this.handleError),
      tap(repos => console.log(`Fetched ${repos.length} GitHub repositories`))
    );
  }

  /**
   * Get recent commits for a specific repository
   * @param repo Repository name
   * @param perPage Number of commits to retrieve (default: 5)
   * @returns Observable of GitHub commits
   */
  getRepoCommits(repo: string, perPage: number = 5): Observable<GitHubCommit[]> {
    return this.http.get<GitHubCommit[]>(
      `${REPO_COMMITS_ENDPOINT(repo)}?per_page=${perPage}`,
      { headers: this.headers }
    ).pipe(
      retry(2),
      catchError(this.handleError),
      tap(commits => console.log(`Fetched ${commits.length} commits for ${repo}`))
    );
  }

  /**
   * Get detailed commit information including file changes
   * @param repo Repository name
   * @param sha Commit SHA
   * @returns Observable of detailed GitHub commit
   */
  getCommitDetail(repo: string, sha: string): Observable<GitHubCommitDetail> {
    return this.http.get<GitHubCommitDetail>(
      COMMIT_ENDPOINT(repo, sha),
      { headers: this.headers }
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /**
   * Get a daily code snippet by analyzing recent commits
   * Prioritizes interesting code files (not config/docs) with meaningful changes
   * @returns Observable of a code snippet
   */
  getDailyCodeSnippet(): Observable<CodeSnippet | null> {
    // First get recent repos
    return this.getUserRepos(5).pipe(
      // Then get commits from the first code repo
      switchMap(repos => {
        // Filter to repos that likely contain code (exclude docs, etc.)
        const codeRepos = repos.filter(repo => 
          !repo.name.includes('docs') && 
          !repo.name.includes('wiki') &&
          repo.language !== null
        );
        
        if (codeRepos.length === 0) {
          return of(null);
        }
        
        // Use the first code repo
        const repo = codeRepos[0];
        return this.getRepoCommits(repo.name, 10).pipe(
          // Then get detailed commit info for a commit with interesting changes
          switchMap(commits => {
            if (commits.length === 0) {
              return of(null);
            }
            
            // Pick a recent commit with a meaningful message
            // (avoid merge commits, version bumps, etc.)
            const interestingCommit = commits.find(commit => 
              !commit.commit.message.toLowerCase().includes('merge') &&
              !commit.commit.message.toLowerCase().includes('version bump') &&
              !commit.commit.message.toLowerCase().includes('readme')
            ) || commits[0];
            
            return this.getCommitDetail(repo.name, interestingCommit.sha);
          }),
          // Extract a code snippet from the commit
          map(commitDetail => {
            if (!commitDetail || !commitDetail.files || commitDetail.files.length === 0) {
              return null;
            }
            
            // Find a file with a patch that contains actual code
            const codeFiles = commitDetail.files.filter(file => {
              // Skip non-code files
              if (file.filename.endsWith('.md') || 
                  file.filename.endsWith('.txt') ||
                  file.filename.endsWith('.json') ||
                  file.filename.includes('LICENSE') ||
                  !file.patch) {
                return false;
              }
              return true;
            });
            
            if (codeFiles.length === 0) {
              return null;
            }
            
            // Pick the file with the most interesting changes
            const file = codeFiles.reduce((best, current) => 
              (current.additions > best.additions) ? current : best
            , codeFiles[0]);
            
            // Extract language from filename
            let language = 'unknown';
            if (file.filename.endsWith('.ts')) language = 'typescript';
            else if (file.filename.endsWith('.js')) language = 'javascript';
            else if (file.filename.endsWith('.html')) language = 'html';
            else if (file.filename.endsWith('.css')) language = 'css';
            else if (file.filename.endsWith('.scss')) language = 'scss';
            else if (file.filename.endsWith('.rs')) language = 'rust';
            else if (file.filename.endsWith('.py')) language = 'python';
            else if (file.filename.endsWith('.java')) language = 'java';
            else if (file.filename.endsWith('.c') || file.filename.endsWith('.cpp') || file.filename.endsWith('.h')) language = 'c++';
            
            // Extract a meaningful snippet from the patch
            let code = '';
            if (file.patch) {
              // Remove diff markers and extract added lines
              const lines = file.patch.split('\n');
              const codeLines = lines
                .filter(line => line.startsWith('+') && !line.startsWith('+++'))
                .map(line => line.substring(1));
              
              // Get a reasonable snippet length (max 15 lines)
              code = codeLines.slice(0, 15).join('\n');
              
              // If snippet is too short, include some context lines too
              if (codeLines.length < 5) {
                code = lines
                  .filter(line => !line.startsWith('-') && !line.startsWith('---'))
                  .map(line => line.startsWith('+') ? line.substring(1) : line)
                  .slice(0, 15)
                  .join('\n');
              }
            }
            
            return {
              filename: file.filename,
              language: language,
              code: code,
              repo: repo.name,
              commitMessage: commitDetail.commit.message,
              commitUrl: commitDetail.html_url,
              commitDate: commitDetail.commit.author.date
            };
          })
        );
      }),
      catchError(error => {
        console.error('Error fetching code snippet:', error);
        return of(null);
      })
    );
  }

  /**
   * Get recent activity summary including both events and commits
   * @returns Observable with combined GitHub activity data
   */
  getActivitySummary(): Observable<{
    events: GitHubEvent[],
    repos: GitHubRepo[],
    latestCommits: GitHubCommit[]
  }> {
    return forkJoin({
      events: this.getUserEvents(5),
      repos: this.getUserRepos(3),
      latestCommits: this.getUserRepos(1).pipe(
        switchMap(repos => {
          if (repos.length === 0) {
            return of([]);
          }
          return this.getRepoCommits(repos[0].name, 3);
        })
      )
    }).pipe(
      catchError(error => {
        console.error('Error fetching GitHub activity summary:', error);
        return of({
          events: [],
          repos: [],
          latestCommits: []
        });
      })
    );
  }

  /**
   * Error handler for HTTP requests
   * @param error The HTTP error response
   * @returns An observable error
   */
  private handleError(error: HttpErrorResponse) {
    if (error.status === 403 && error.headers.get('X-RateLimit-Remaining') === '0') {
      console.error('GitHub API rate limit exceeded. Reset at:', 
        new Date(parseInt(error.headers.get('X-RateLimit-Reset') || '0') * 1000));
      return throwError(() => new Error('GitHub API rate limit exceeded. Please try again later.'));
    }
    
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error('Client error:', error.error.message);
    } else {
      // Backend returned unsuccessful response code
      console.error(
        `GitHub API returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    
    return throwError(() => new Error('Something went wrong with the GitHub API request. Please try again later.'));
  }
}
