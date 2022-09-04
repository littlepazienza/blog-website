import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


/*
 * The path to the endpoint returning the list of all blog entries. 
 */
const GET_ALL_BLOGS_ENDPOINT = "http://localhost:34000/manage/all";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) {}

  getAllBlogs(): Observable<string> {
    return this.httpClient.get(GET_ALL_BLOGS_ENDPOINT, {responseType: 'text'});
  }
}
