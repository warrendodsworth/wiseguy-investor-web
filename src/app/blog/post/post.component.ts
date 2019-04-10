import { Component, Input, OnInit } from '@angular/core';

import { UtilService } from '../../util.service';
import { BlogService } from '../blog.service';
import { Post } from '../post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  @Input() admin: boolean = false;

  constructor(
    public _blog: BlogService,
    public _util: UtilService) { }

  ngOnInit() {
  }

  async delete(postId: string) {
    await this._blog.deletePost(postId)
    this._util.toastr.info('Post deleted')
  }

}
