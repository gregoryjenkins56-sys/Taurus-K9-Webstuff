/* Route content for /terms. */
import { SITE } from '../config.js';
import { I, CTAB, CTAC, hero, phero, sec, card, chk, grid, steps, band, faqBlock, FAQS, faqPick, REVIEWS, revBlock } from '../modules/page-shared.js';
export default {title:'Terms of Service | Taurus K9',
  desc:'Terms governing the use of taurusk9.com and the purchase of dog training services from Taurus K9, including booking, payment, cancellation and liability provisions.',
  render(){
    return phero({title:'Terms of Service', lede:'The terms that govern our website and training services.', crumbs:[{label:'Home',href:'#/'},{label:'Terms of Service'}]})
    + sec({
        body:`<div class="prose">
          <div class="note"><p><strong>Template notice.</strong> General informational terms only, not legal advice. Have counsel draft or review your final agreements, and confirm insurance, vaccination and liability language with your carrier.</p></div>
          <p><em>Last updated: [DATE]</em></p>
          <h2>Agreement</h2><p>By using www.taurusk9.com or purchasing services from Taurus K9, you agree to these terms. If you do not agree, do not use the site or services.</p>
          <h2>Services</h2><p>We provide dog training services including Board and Train, private lessons, puppy programs, day training, behavior modification, and working dog or agency programs. Program scope and pricing are confirmed in writing before training begins. Program lengths quoted are typical ranges; actual duration depends on the individual dog.</p>
          <h2>Booking and payment</h2><p>[DEPOSIT TERMS] [PAYMENT SCHEDULE] [ACCEPTED PAYMENT METHODS] Reservations may require a deposit. Balances are due as stated in your agreement.</p>
          <h2>Cancellation and rescheduling</h2><p>[CANCELLATION WINDOW] [RESCHEDULING POLICY] [REFUND POLICY, if any]. Please give us as much notice as possible so we can offer the slot to another client.</p>
          <h2>Health, vaccinations and behavior disclosure</h2><p>You agree to disclose your dog known health conditions, medications, bite history and prior training. You confirm your dog is current on vaccinations and free of communicable illness, or that a veterinarian has cleared training. Failure to disclose a bite history or aggression may result in termination of services.</p>
          <h2>Risk and liability</h2><p>Working with animals involves inherent risk. [LIABILITY LANGUAGE TO BE COMPLETED WITH COUNSEL AND INSURER.] Taurus K9 carries business insurance; a certificate of insurance is available on request.</p>
          <h2>Training tools</h2><p>Where training tools are used, they are optional and introduced through proper imprinting, conditioning and handler education. You may decline their use.</p>
          <h2>Intellectual property</h2><p>Site content, written training plans and materials are the property of Taurus K9 and may not be reproduced or redistributed without permission.</p>
          <h2>Photography and media</h2><p>Unless you opt out in writing, you grant Taurus K9 permission to use photographs or video of your dog taken during training for our website and social media. We will not publish your full name or address without consent.</p>
          <h2>Limitation of warranties</h2><p>Training outcomes depend on many factors including the dog, the environment and client follow-through. We do not guarantee a specific result. We commit to applying professional standards and delivering the program described in your agreement.</p>
          <h2>Governing law</h2><p>These terms are governed by the laws of the State of Texas. Venue for disputes lies in [COUNTY] County, Texas.</p>
          <h2>Contact</h2><p>Taurus K9 &middot; Aransas Pass, TX 78336 &middot; <a href="mailto:${SITE.email}">${SITE.email}</a> &middot; <a href="tel:${SITE.phone}">${SITE.phoneDisplay}</a></p>
        </div>`
      });
  }
}
