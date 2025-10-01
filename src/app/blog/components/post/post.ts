import { Component, Input, OnInit } from '@angular/core';

import { UtilService } from '../../../core/services/util.service';
import { SHARED_CONFIG } from '../../../shared/shared.config';
import { Post } from '../../post';

@Component({
  selector: 'app-post',
  templateUrl: './post.html',
  imports: [SHARED_CONFIG],
})
export class PostComponent implements OnInit {
  @Input() post: Post | undefined;
  @Input() admin = false;

  constructor(public util: UtilService) {}

  ngOnInit() {}
}
