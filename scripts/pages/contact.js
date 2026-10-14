/* Route content for /contact. */
import { SITE } from '../config.js';
import { leadForm } from '../modules/forms.js';
import { I, CTAB, CTAC, hero, phero, sec, card, chk, grid, steps, band, faqBlock, FAQS, faqPick, REVIEWS, revBlock } from '../modules/page-shared.js';
export default {title:'Contact Taurus K9 | Book a Free Meet & Greet | Aransas Pass, TX',
  desc:'Book your free in-person dog training consultation with Taurus K9 in Aransas Pass, TX. Call 361-230-1932 or send an inquiry for Board and Train, private lessons, detection or police K9 programs.',
  render(){
    const hours = SITE.hours.map(h => `<li><span>${h[0]}</span><b>${h[1]}</b></li>`).join('');
    return phero({
      tag:'Contact &amp; Booking',
      title:'Book your free meet and greet.',
      lede:'Tell us about your dog and what you want to change. We will respond with the right next step, usually within one business day and often the same day during business hours.',
      crumbs:[{label:'Home',href:'#/'},{label:'Contact'}],
      actions:`<a class="button button--primary" href="tel:${SITE.phone}" data-track="click_to_call" data-loc="contact_hero">Call ${SITE.phoneDisplay}</a>
        <a class="button button--outline" href="${SITE.bookingUrl}" target="_blank" rel="noopener" data-track="schedule_click">Open the booking calendar</a>`
    })
    + sec({
        body:`<div class="contact-grid">
          <div>
            <h2 class="utility--inline-495e1c86">Send us a training inquiry</h2>
            <p class="footnote utility--inline-561f378b">Fields marked <span class="form__required" aria-hidden="true">*</span> are required. Prefer to talk? Call <a href="tel:${SITE.phone}" data-track="click_to_call" data-loc="form_intro">${SITE.phoneDisplay}</a>.</p>
            ${leadForm()}
          </div>
          <aside aria-labelledby="napH">
            <div class="card">
              <h2 id="napH" class="utility--inline-0678ae86">Contact details</h2>
              <ul class="nap">
                <li>${I.phone}<span><b>Phone</b><br><a href="tel:${SITE.phone}" data-track="click_to_call" data-loc="nap">${SITE.phoneDisplay}</a><br><span class="utility--inline-18d5c7f7">Mon&ndash;Fri, 6:00 AM &ndash; 6:00 PM CT</span></span></li>
                <li>${I.mail}<span><b>Email</b><br><a href="mailto:${SITE.email}" data-track="click_to_email">${SITE.email}</a></span></li>
                <li>${I.pin}<span><b>Location</b><br>${SITE.city}, ${SITE.state} ${SITE.zip}<br><span class="utility--inline-18d5c7f7">Serving the Coastal Bend. Exact address confirmed at booking.</span></span></li>
                <li>${I.clock}<span><b>Hours</b><ul class="hours">${hours}</ul></span></li>
              </ul>
              <div class="button-row utility--inline-b700c0fc">
                <a class="button button--green button--small" href="tel:${SITE.phone}" data-track="click_to_call" data-loc="nap_btn">Call now</a>
                <a class="button button--outline button--small" href="sms:${SITE.phone}" data-track="click_to_text" data-loc="nap_btn">Text us</a>
              </div>
            </div>
            <div class="card utility--inline-b700c0fc">
              <h2 class="utility--inline-0678ae86">What happens next</h2>
              <ol class="utility--inline-75224889">
                <li>We confirm your inquiry, usually within one business day.</li>
                <li>We schedule your free in-person meet and greet.</li>
                <li>You get a written program recommendation and quote.</li>
                <li>You decide. No deposit required to talk.</li>
              </ol>
            </div>
            <div class="card utility--inline-b700c0fc">
              <h2 class="utility--inline-0678ae86">Working dogs and agencies</h2>
              <p class="utility--inline-77c5982b">Select <em>Agency or department program</em> or <em>Detection dog training</em> in the form and your inquiry is routed to the working dog division for a proposal.</p>
            </div>
          </aside>
        </div>`
      })
    + sec({bg:'cream', h2:'Before you book, these may help', body: faqBlock(FAQS.slice(0,4))});
  }
}
