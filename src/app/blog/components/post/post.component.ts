import { Component, Input, OnInit } from '@angular/core';

import { UtilService } from '../../../core/services/util.service';
import { Post } from '../../post';
import { PostService } from '../../post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  @Input() admin = false;

  constructor(public _blog: PostService, public util: UtilService) {}

  ngOnInit() {}

  async deletePost(postId: string) {
    const res = confirm('Are you sure?');
    if (res) await this._blog.deletePost(postId);
  }
}
