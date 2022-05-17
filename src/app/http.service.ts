import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


const GET_ALL_BLOGS_ENDPOINT = "http://71.192.160.144:10443/manage/all";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) {}

  getAllBlogs(): Observable<string> {
    return this.httpClient.get(GET_ALL_BLOGS_ENDPOINT, {responseType: 'text'});
  }
}
