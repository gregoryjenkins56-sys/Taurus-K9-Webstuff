/* Route content for /reviews. */
import { SITE, CONFIG } from '../config.js';
import { I, CTAB, CTAC, hero, phero, sec, card, chk, grid, steps, band, faqBlock, FAQS, faqPick, REVIEWS, revBlock } from '../modules/page-shared.js';
export default {title:'Reviews & Transformations | Taurus K9 Dog Training, Coastal Bend TX',
  desc:'Client reviews for Taurus K9 dog training in Aransas Pass, Corpus Christi and the Texas Coastal Bend, including Board and Train, private lessons, behavior modification and agency K9 programs.',
  render(){
    return phero({
      tag:'Reviews &amp; Transformations',
      title:'Real clients, real transformations.',
      lede:'The proof of a training program is what happens thirty days after handoff. These are the outcomes clients report.',
      crumbs:[{label:'Home',href:'#/'},{label:'Reviews'}],
      actions: CTAB
    })
    + sec({
        body:`<p class="disc utility--inline-767e3336"><strong>Template content, replace before launch.</strong> Do not publish invented testimonials. Pull your real Google and Facebook reviews, keep the wording verbatim, and only add Review structured data for reviews you can verify.</p>
          ${grid(REVIEWS.map(revBlock),'grid--two')}
          <div class="button-row utility--inline-ea2d862b">
            <a class="button button--outline" href="${CONFIG.facebookReviewsUrl}" target="_blank" rel="noopener" data-track="social_click" data-loc="facebook">Reviews on Facebook</a>
            <a class="button button--outline" href="#/contact?service=board-train">Start my dog program</a>
          </div>`
      })
    + sec({
        bg:'cream', h2:'Results by program',
        body:`<table class="data">
          <caption>What clients typically report after each program</caption>
          <thead><tr><th scope="col">Program</th><th scope="col">Typical reported outcome</th><th scope="col">Timeframe</th></tr></thead>
          <tbody>
            <tr><th scope="row">Board &amp; Train, Basic</th><td>House manners, reliable commands, off-leash foundation</td><td>4&ndash;6 weeks</td></tr>
            <tr><th scope="row">Board &amp; Train, Advanced</th><td>Off-leash reliability and public manners</td><td>6&ndash;8 weeks</td></tr>
            <tr><th scope="row">Behavior Modification</th><td>Managed reactivity, reduced anxiety, household safety</td><td>8&ndash;12+ weeks</td></tr>
            <tr><th scope="row">Private Lessons</th><td>Owner handling confidence plus measurable obedience gains</td><td>Weekly</td></tr>
            <tr><th scope="row">Agency and Detection</th><td>Certification readiness and sustained field performance</td><td>Per contract</td></tr>
          </tbody>
        </table>`
      })
    + sec({body: band({})});
  }
}
