import { Component, OnInit } from '@angular/core';

import { LayoutService } from '../../shared/services/layout.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  constructor(public layout: LayoutService) {}

  ngOnInit() {
    this.layout.disableContainer = true;
  }
}
