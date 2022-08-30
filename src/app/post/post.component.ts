import { Component, OnInit, Input  } from '@angular/core';
import { Blog } from '../blog';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() blog!: Blog;

  constructor() { }

  ngOnInit(): void {
  }

}
