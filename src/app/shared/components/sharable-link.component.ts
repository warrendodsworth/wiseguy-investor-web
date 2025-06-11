import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sharable-link',
  template: `
    <!-- Display the shareable link -->
    <div *ngIf="shareableLink" class="mx-auto mt-4 p-4 bg-gray-100 text-gray-700 rounded-lg">
      <strong>Direct link to the page with these results: </strong>
      <a href="{{ shareableLink }}" target="_blank" class="text-blue-500">{{ shareableLink }}</a>
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class SharableLinkComponent implements OnInit {
  constructor() {}

  @Input() shareableLink: string = ''; // The direct shareable link

  ngOnInit() {}
}
