import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Blog } from './blog';

/*
 * The path to the endpoint returning the list of all blog entries.
 */
const GET_ALL_BLOGS_ENDPOINT = "https://server.blog.ienza.tech/manage/all";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) {}

  /**
   * Fetch all blog entries.
   *
   * The backend returns a JSON array of Blog objects – use HttpClient’s
   * generic parameter to automatically deserialize the response.
   */
  getAllBlogs(): Observable<Blog[]> {
    return this.httpClient
      .get<Blog[]>(GET_ALL_BLOGS_ENDPOINT)
      .pipe(
        retry(2),                 // retry a couple of times before failing
        catchError(this.handleError)
      );
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
