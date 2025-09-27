import { Component, Input, OnInit } from '@angular/core';

import { UtilService } from '../../../core/services/util.service';
import { Post } from '../../post';
import { PostService } from '../../post.service';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-post',
  templateUrl: './post.html',
  imports: [SharedModule],
})
export class PostComponent implements OnInit {
  @Input() post: Post | undefined;
  @Input() admin = false;

  constructor(public util: UtilService) {}

  ngOnInit() {}
}
