import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MailService {
  constructor() {}

  // subscriber: any = {};
  // subscribeToMailingList(user) {
  //   var body = "FNAME=" + user.firstname + "&LNAME=" + user.lastname + "&EMAIL=" + user.email;

  //   this.http.post("https://skaoss.us14.list-manage.com/subscribe/post?u=f87d6e1ec58cd04830f6a367b&amp;id=e58a2a6af0", body)
  //     .subscribe((data) => {
  //       console.log(data)
  //       this.subscriber = {};
  //     });
  // }
}

//  <img class="mb-2" src="../../assets/brand/bootstrap-solid.svg" alt="" width="24" height="24">

//  Begin Mailchimp Signup Form
//  <div id="mc_embed_signup" class="text-center py-5 my-5 bg-white rounded">
//     <h2>Subscribe to our mailing list</h2>

//     <form action="https://skaoss.us14.list-manage.com/subscribe/post?u=f87d6e1ec58cd04830f6a367b&amp;id=e58a2a6af0"
//       class="validate form-inline justify-content-center" method="post" id="mc-embedded-subscribe-form"
//       name="mc-embedded-subscribe-form" target="_blank" novalidate>

//       <input type="email" [(ngModel)]="subscriber.email" placeholder="Your email" name="EMAIL"
//         class="required email form-control mb-2 mr-sm-2" id="mce-EMAIL">

//       <input placeholder="Your name" name="FNAME" class="form-control mb-2 mr-sm-2" id="mce-FNAME">

//       <input placeholder="Your surname" name="LNAME" class="form-control mb-2 mr-sm-2" id="mce-LNAME">

//       <button type="submit" name="subscribe" id="mc-embedded-subscribe"
//         class="button btn btn-secondary text-light mb-2">Subscribe</button>

//       <div id="mce-responses" class="clear">
//         <div class="response" id="mce-error-response" style="display:none"></div>
//         <div class="response" id="mce-success-response" style="display:none"></div>
//       </div>

//       <div style="position: absolute; left: -5000px;" aria-hidden="true">
//         <input type="text" name="b_f87d6e1ec58cd04830f6a367b_e58a2a6af0" tabindex="-1" value="">
//       </div>
//     </form>
//   </div>
// End mc_embed_signup
