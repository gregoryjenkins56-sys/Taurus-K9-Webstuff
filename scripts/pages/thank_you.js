/* Route content for /thank-you. */
import { SITE } from '../config.js';
import { I, CTAB, CTAC, hero, phero, sec, card, chk, grid, steps, band, faqBlock, FAQS, faqPick, REVIEWS, revBlock } from '../modules/page-shared.js';
export default {title:'Thank You | Your Inquiry Was Received | Taurus K9',
  desc:'Your training inquiry has been received by Taurus K9. Here is what happens next.',
  render(){
    return phero({
      tag:'Inquiry received',
      title:'Thank you. Your inquiry is in.',
      lede:'We have your information and it is already routed to the right trainer. Here is exactly what happens next.',
      crumbs:[{label:'Home',href:'#/'},{label:'Thank you'}]
    })
    + sec({
        body: grid([
          card({icon:I.check, h3:'1. Confirmation', body:'<p>You will receive an email confirmation immediately. If you opted into text messages, you may also get a short text from our team.</p>'}),
          card({icon:I.chat, h3:'2. A real reply', body:'<p>A trainer reviews your inquiry and responds within one business day, often same-day during business hours. Expect a question or two about your dog.</p>'}),
          card({icon:I.paw, h3:'3. Your free meet and greet', body:'<p>We schedule the in-person consultation at your convenience, your dog comes too, and you leave with a written recommendation and quote.</p>'})
        ],'grid--three')
        + `<p class="utility--inline-0e83ee94">Need to talk sooner? <a href="tel:${SITE.phone}" data-track="click_to_call" data-loc="thankyou">Call ${SITE.phoneDisplay}</a> (Mon&ndash;Fri, 6:00 AM &ndash; 6:00 PM CT).</p>
          <p class="footnote">A record of this submission was created in our CRM with a timestamped consent record. <a href="#/privacy">Privacy Policy</a> &middot; <a href="#/contact">Submit another inquiry</a></p>`
      })
    + sec({bg:'cream', body: band({h2:'While you wait, explore our programs.', cta:'See All Programs', p:'Board and Train, private lessons, puppy foundations, detection and police K9 training.'})});
  }
}
