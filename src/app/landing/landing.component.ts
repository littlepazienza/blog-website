import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service'

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  title = 'blog-website';
  allBlogs: string = "";
  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.getAllBlogs().subscribe(data => {
      this.allBlogs = data;
    });
  }

  getStory(story: String) {
    console.log(this.allBlogs);
    let leftovers = JSON.parse(this.allBlogs).blogs.filter((blog: any) => blog.story == story);
    if (leftovers.length > 0) {
      return JSON.stringify(leftovers);
    }
    return "";
  }
}
