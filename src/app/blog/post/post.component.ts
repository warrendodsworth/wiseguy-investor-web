import { Component, Input, OnInit } from '@angular/core';
import { UtilService } from '../../util.service';
import { Post } from '../post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post: Post;

  constructor(public _util: UtilService) { }

  ngOnInit() {
  }

}
