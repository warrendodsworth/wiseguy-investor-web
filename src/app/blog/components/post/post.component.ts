import { Component, Input, OnInit } from '@angular/core';

import { UtilService } from '../../../core/services/util.service';
import { Post } from '../../post';
import { PostService } from '../../post.service';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  standalone: true,
  imports: [SharedModule],
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  @Input() admin = false;

  constructor(public _blog: PostService, public util: UtilService) {}

  ngOnInit() {}
}
