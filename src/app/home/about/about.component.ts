import { Component, OnInit } from '@angular/core';

import { LayoutService } from '../../core/services/layout.service';

@Component({
  templateUrl: './about.component.html',
})
export class AboutComponent implements OnInit {
  constructor(public layout: LayoutService) {}

  ngOnInit() {}
}
