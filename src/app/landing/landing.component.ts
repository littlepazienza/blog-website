import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service'
import { Blog } from '../blog';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  title = 'blog-website';
  allBlogs: Blog[] = [];
  constructor(private httpService: HttpService) {}

  /*
   * Initialize the landing component, load the blog posts from the server.
   */
  ngOnInit(): void {
    this.httpService.getAllBlogs().subscribe(data => {
      this.allBlogs = JSON.parse(data).blogs;
      console.log(this.allBlogs);
    });
  }

  // getStory(story: String) {
  //   console.log(this.allBlogs);
  //   let leftovers = JSON.parse(this.allBlogs).blogs.filter((blog: any) => blog.story == story);
  //   if (leftovers.length > 0) {
  //     return JSON.stringify(leftovers);
  //   }
  //   return "";
  // }
}
