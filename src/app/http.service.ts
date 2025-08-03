import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
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
   * Fetch all blog entries.
   *
   * The backend returns a JSON array of Blog objects – use HttpClient's
   * generic parameter to automatically deserialize the response.
   * 
   * TEMPORARY: Using mock data service while backend is not running.
   * Remove this and uncomment the HTTP client code when backend is available.
   */
  getAllBlogs(): Observable<Blog[]> {
    // TEMPORARY: Using mock data instead of real HTTP request
    return this.mockBlogDataService.getBlogData();
    
    // Uncomment when backend is available:
    /*
    return this.httpClient
      .get<Blog[]>(GET_ALL_BLOGS_ENDPOINT)
      .pipe(
        retry(2),                 // retry a couple of times before failing
        catchError(this.handleError)
      );
    */
  }

  /**
   * Simple error-handler that logs the error and re-throws it so
   * subscribers can react accordingly.
   */
  private handleError(error: any) {
    // In a real-world app we might send the error to remote logging infra
    console.error('HTTP error occurred:', error);
    return throwError(() => error);
  }
}
