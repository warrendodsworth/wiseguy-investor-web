import { Component, Input, OnInit } from '@angular/core';

import { UtilService } from '../../shared/services/util.service';
import { BlogService } from '../blog.service';
import { Post } from '../post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  @Input() admin = false;

  constructor(public _blog: BlogService, public _util: UtilService) {}

  ngOnInit() {}

  async delete(postId: string) {
    const res = confirm('Are you sure?');
    if (res) {
      await this._blog.deletePost(postId);
      this._util.toastr.info('Post deleted');
    }
  }
}
