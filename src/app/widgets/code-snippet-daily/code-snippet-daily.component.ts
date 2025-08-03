import { Component, OnInit } from '@angular/core';
import { GithubApiService, CodeSnippet } from '../../services/github-api.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-code-snippet-daily',
  templateUrl: './code-snippet-daily.component.html',
  styleUrls: ['./code-snippet-daily.component.css']
})
export class CodeSnippetDailyComponent implements OnInit {

  /** Loading state shown in template */
  loading = true;

  /** Error flag – can be replaced with message later */
  error = false;

  /** Highlighted code snippet */
  snippet: CodeSnippet | null = null;

  constructor(private githubApi: GithubApiService) { }

  ngOnInit(): void {
    this.loading = true;
    this.error   = false;

    this.githubApi.getDailyCodeSnippet()
      .pipe(
        catchError(err => {
          console.error('Failed to load daily snippet', err);
          this.error = true;
          this.loading = false;
          return of(null);
        })
      )
      .subscribe(snippet => {
        this.snippet = snippet;
        this.loading = false;
      });
  }

}
