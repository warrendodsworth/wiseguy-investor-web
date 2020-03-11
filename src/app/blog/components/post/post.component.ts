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

  constructor(public blogService: PostService, public util: UtilService) {}

  ngOnInit() {}

  async delete(postId: string) {
    const res = confirm('Are you sure?');
    if (res) await this.blogService.deletePost(postId);
  }
}
