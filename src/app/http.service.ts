import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { Blog } from './blog';
import { MockBlogDataService } from './services/mock-blog-data.service';

/*
 * The path to the endpoint returning the list of all blog entries.
 */
/**
 * NOTE: During local development we point the frontend directly at the
 * Docker-compose Rocket instance (port 34001).  Update this value (or make
 * it environment-specific) when deploying to staging/production.
 */
const GET_ALL_BLOGS_ENDPOINT = "http://localhost:34001/manage/all";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient, private mockBlogDataService: MockBlogDataService) {}

  /**
   * Toggle between mock-data service and real backend.
   * NOW USING REAL NODE.JS BACKEND.
   */
  private USE_MOCK_DATA = false;

  /**
   * Fetch all blog entries.
   *
   * The backend returns a JSON array of Blog objects – use HttpClient's
   * generic parameter to automatically deserialize the response.
   * 
   * TEMPORARY: Using mock data service while backend is not running.
   * Remove this and uncomment the HTTP client code when backend is available.
   */
  getAllBlogs(): Observable<Blog[]> {
    console.log(
      `[HttpService] getAllBlogs() → mode: ${this.USE_MOCK_DATA ? 'MOCK' : 'API'}`
    );

    if (this.USE_MOCK_DATA) {
      // Development mode – pull from local in-memory service
      return this.mockBlogDataService
        .getBlogData()
        .pipe(
          tap(data =>
            console.log(
              `[HttpService] Mock service returned ${data?.length ?? 0} posts`
            )
          )
        );
    }

    // Real backend mode
    console.log(`[HttpService] Fetching from ${GET_ALL_BLOGS_ENDPOINT}`);
    return this.httpClient
      .get<Blog[]>(GET_ALL_BLOGS_ENDPOINT)
      .pipe(
        tap(data =>
          console.log(
            `[HttpService] API response received – ${data?.length ?? 0} posts`
          )
        ),
        retry(2),                 // retry a couple of times before failing
        catchError(this.handleError)
      );
  }

  /**
   * Call this from any component/service after Docker backend comes online.
   */
  switchToRealBackend(): void {
    this.USE_MOCK_DATA = false;
  }

  /**
   * Simple error-handler that logs the error and re-throws it so
   * subscribers can react accordingly.
   */
  private handleError(error: any) {
    // Provide more context in console for easier debugging
    if (error.status === 0) {
      console.error('Network error – backend may be unreachable:', error);
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    return throwError(() => error);
  }
}
