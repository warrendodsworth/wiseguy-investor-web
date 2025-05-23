import { Component } from '@angular/core';

@Component({
  selector: 'core-spinner',
  standalone: true,
  imports: [],
  template: `
    <div class="flex justify-center items-center">
      <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
    </div>

    <!-- Blue -->
    <!-- <div  class="flex justify-center items-center h-32">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
    </div> -->
  `,
})
export class SpinnerComponent {}
