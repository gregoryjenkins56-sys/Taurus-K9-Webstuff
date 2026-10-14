/* Route content for /pet-training. */
import { SITE } from '../config.js';
import { I, CTAB, CTAC, hero, phero, sec, card, chk, grid, steps, band, faqBlock, FAQS, faqPick, REVIEWS, revBlock } from '../modules/page-shared.js';
export default {title:'Pet Dog Training: Board & Train, Private Lessons, Puppy Training | Taurus K9',
  desc:'Pet dog training in Aransas Pass, Corpus Christi and the Coastal Bend. Board and Train, private lessons, puppy foundations, day training and behavior modification with certified trainers.',
  render(){
    return phero({
      tag:'Pet Dog Training',
      title:'Training your dog for your actual life.',
      lede:'Obedience that works in your kitchen, on your street and at the vet, not just in a training facility. Choose the format that fits your schedule, your dog and your budget.',
      crumbs:[{label:'Home',href:'#/'},{label:'Pet Dog Training'}],
      actions: CTAB + CTAC
    })
    + sec({h2:'Programs', body: grid([
        card({icon:I.home, tag:'Most popular', h3:'Board &amp; Train',
          body:`<p>Your dog lives with our certified trainers and receives multiple structured sessions daily in varied, real-world settings. Fast, deep behavior change for busy owners.</p><p><strong>4&ndash;12 weeks</strong> depending on track.</p>`,
          foot:`<a class="button button--green button--small" href="#/board-train">Board &amp; Train options</a>`}),
        card({icon:I.user, h3:'Private Lessons',
          body:`<p>One-on-one sessions built around your dog goals and challenges, in your home and neighborhoods. You learn side by side with the trainer.</p><p><strong>Single sessions or packages.</strong></p>`,
          foot:`<a class="button button--green button--small" href="#/private-lessons">Private lesson details</a>`}),
        card({icon:I.paw, h3:'Puppy Foundations',
          body:`<p>Start before problems start. Socialization, handling, household routines and a confident foundation from 8 weeks old.</p>`,
          foot:`<a class="button button--green button--small" href="#/puppy-foundations">Puppy program</a>`}),
        card({icon:I.clock, h3:'Day Training',
          body:`<p>Trainer-led sessions during the day while you work, with transfer sessions so the handling transfers to you.</p>`,
          foot:`<a class="button button--green button--small" href="#/day-training">Day training details</a>`}),
        card({icon:I.shield, acc:true, tag:'Advanced', h3:'Behavior Modification',
          body:`<p>A custom plan for aggression, anxiety or reactivity. Longer timeline, careful management, honest expectations set at the assessment.</p>`,
          foot:`<a class="button button--green button--small" href="#/board-train">Behavior programs</a>`}),
        card({icon:I.check, h3:'Personal Protection',
          body:`<p>For owners who want a trained family dog with reliable protective capability. Assessed individually; not every dog or family is the right fit.</p>`,
          foot:`<a class="button button--green button--small" href="#/working-dogs">Protection training</a>`})
      ],'grid--two')})
    + sec({
        bg:'cream', eyebrow:'Choose with confidence', h2:'How to pick the right format',
        body:`<table class="data">
          <caption>Comparing formats at a glance</caption>
          <thead><tr><th scope="col">Format</th><th scope="col">Best for</th><th scope="col">Typical length</th><th scope="col">Your involvement</th></tr></thead>
          <tbody>
            <tr><th scope="row">Board &amp; Train</th><td>Busy schedules, fast behavior change</td><td>4&ndash;12 weeks</td><td>Handoff and transfer sessions</td></tr>
            <tr><th scope="row">Private Lessons</th><td>Building your own handling skills</td><td>Weekly, ongoing</td><td>Every session</td></tr>
            <tr><th scope="row">Puppy Foundations</th><td>Puppies 8 weeks to 6 months</td><td>4&ndash;8 weeks</td><td>Every session</td></tr>
            <tr><th scope="row">Day Training</th><td>Owners away during the workday</td><td>4&ndash;8 weeks</td><td>Transfer sessions</td></tr>
            <tr><th scope="row">Behavior Modification</th><td>Aggression, anxiety, reactivity</td><td>8&ndash;12+ weeks</td><td>Essential: consistency required</td></tr>
          </tbody>
        </table>`
      })
    + sec({body: band({h2:'Not sure which program fits? That is what the free meet and greet is for.', cta:'Book My Free Meet and Greet'})});
  }
}
