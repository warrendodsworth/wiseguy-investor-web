import { Component, OnInit } from '@angular/core';

import { ConfigService } from '../../core/services/config.service';

@Component({
  templateUrl: './about.html',
})
export class AboutComponent implements OnInit {
  constructor(public config: ConfigService) {}

  ngOnInit() {}
}
