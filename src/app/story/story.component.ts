import { Component, OnInit, Input  } from '@angular/core';
import { Blog } from '../blog';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {
  @Input() allBlogs!: Blog[];
  @Input() story!: String;

  constructor() {}

  ngOnInit(): void {
    this.allBlogs = this.allBlogs.filter((blog: any) => blog.story == this.story)
  }

}
