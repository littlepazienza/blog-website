import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
    /* ------------------------------------------------------------------
     * In the future this will call a small service that fetches a snippet
     * from GitHub (or another API) every 24 h.  For now we simulate it
     * with a short timeout and mock data so the UI already works.
     * ------------------------------------------------------------------ */
    setTimeout(() => {
      try {
        /* Example: utility debounce function written in TypeScript */
        const mockSnippet: CodeSnippet = {
          functionName: 'debounce',
          repoName: 'blog-website',
          repoUrl: 'https://github.com/littlepazienza/blog-website',
          fileUrl:
            'https://github.com/littlepazienza/blog-website/blob/main/src/app/utils/debounce.ts',
          code: `/**
 * Returns a debounced version of the provided function. The debounced
 * function postpones its execution until after \`delay\` ms have elapsed
 * since the last time it was invoked.
 */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay = 300
): (...funcArgs: Parameters<T>) => void {
  let timer: any;
  return (...args: Parameters<T>): void => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}`,
          description:
            'A generic “debounce” utility that limits how often a function ' +
            'can fire.  Useful for optimising scroll / resize listeners or ' +
            'text-input events in Angular applications.'
        };

        this.snippet = mockSnippet;
      } catch (e) {
        console.error('Failed to load daily snippet', e);
        this.error = true;
      } finally {
        this.loading = false;
      }
    }, 800); // simulate latency
  }

}

/* --------------------------------------------------------------------
 * Interface describing the shape of a highlighted code snippet
 * ------------------------------------------------------------------ */
interface CodeSnippet {
  /** Name of the exported function or class */
  functionName: string;
  /** Repository containing the file */
  repoName: string;
  /** Link to the repository */
  repoUrl: string;
  /** Direct link to the file on GitHub */
  fileUrl: string;
  /** Raw code string shown in the widget */
  code: string;
  /** Human-readable description of what the code does */
  description: string;
}
