/* Route content for /about. */
import { SITE } from '../config.js';
import { I, CTAB, CTAC, hero, phero, sec, card, chk, grid, steps, band, faqBlock, FAQS, faqPick, REVIEWS, revBlock } from '../modules/page-shared.js';
export default {title:'About Taurus K9 | Certified Dog Trainers in Aransas Pass, Texas',
  desc:'Meet the Taurus K9 team: Greg and Rebecca, Police K9 Master Trainers (Tarheel Canine Inc.), NEPOPO Silver School graduates and Demanet Academy certified police decoys. Our story and training philosophy.',
  render(){
    return phero({
      tag:'About Us',
      title:'Get to know us, then let us meet.',
      lede:'Taurus K9 was founded with a mission to provide exceptional dog training services that transform both dogs and their owners. See the difference our passion and expertise can make for your dog.',
      crumbs:[{label:'Home',href:'#/'},{label:'About Us'}],
      actions: CTAB + CTAC
    })
    + sec({
        bg:'cream', eyebrow:'Our story', h2:'Built to serve both ends of the leash',
        body:`<div class="measure">
          <p>Taurus K9 was founded with a mission to provide exceptional dog training services that transform both dogs and their owners. Our team of certified trainers brings years of experience in obedience, behavior modification, and specialized working dog techniques.</p>
          <p>We believe in positive reinforcement methods combined with clear communication to create lasting results. Whether you have a new puppy or an adult dog with behavioral challenges, we have the expertise to help.</p>
          <p class="utility--inline-7e7454ed">Our philosophy is simple: every dog deserves training that enhances their life and strengthens their bond with their family.</p>
          <p>That philosophy is why we train pet dogs and working dogs under one roof. A family dog learning to settle on a mat and a police K9 holding an indication in a parking lot are doing the same thing: making choices under pressure. The standard does not change; only the environment does.</p>
        </div>`
      })
    + sec({
        eyebrow:'Meet the team', h2:'Certified professionals dedicated to your dog success',
        body: grid([
          `<article class="card"><div class="person">
            <span class="avatar" aria-hidden="true">G</span>
            <div>
              <h3>Greg</h3>
              <p class="person__role">Trainer &middot; Working Dog Division</p>
              <p>A 21-year Army veteran, Greg brings military discipline and unwavering dedication to his dog training, which leads to proven results.</p>
              <ul class="cred">
                <li>Tarheel Canine Inc. &mdash; Police K9 Master Trainer</li>
                <li>NEPOPO Silver School</li>
                <li>Demanet Academy &mdash; Police Decoy LVL 1</li>
              </ul>
            </div>
          </div></article>`,
          `<article class="card"><div class="person">
            <span class="avatar avatar--branded" aria-hidden="true">R</span>
            <div>
              <h3>Rebecca</h3>
              <p class="person__role">Trainer &middot; Pet and Behavior</p>
              <p>Rebecca training approach is second to none, combining unparalleled expertise with a personalized touch that delivers exceptional results for every dog.</p>
              <ul class="cred">
                <li>Tarheel Canine Inc. &mdash; Police K9 Master Trainer</li>
                <li>NEPOPO Silver School</li>
              </ul>
            </div>
          </div></article>`
        ],'grid--two')
      })
    + sec({
        bg:'dark', eyebrow:'Certifications',
        h2:'We maintain the highest standards in training education and methodology',
        body: grid([
          card({h3:'Tarheel Canine Inc.', body:'<p>Police K9 Master Trainer certification, a recognized credential in the working dog community.</p>'}),
          card({h3:'NEPOPO Silver School', body:'<p>Completion of the Silver School curriculum in working dog development.</p>'}),
          card({h3:'Demanet Academy', body:'<p>Police Decoy Level 1 certification for safe, realistic scenario work.</p>'}),
          card({h3:'Ongoing education', body:'<p>We continue developing methodology rather than repeating what we learned years ago.</p>'})
        ],'grid--two')
      })
    + sec({
        eyebrow:'How we train', h2:'Set the dog up for success',
        body: grid([
          card({icon:I.chart, h3:'Assess the individual', body:'<p>Every plan starts with the dog temperament, drives and history, not a script.</p>'}),
          card({icon:I.paw, h3:'Motivational methods', body:'<p>Low-stress learning and clear reinforcement produce faster, more durable results than pressure.</p>'}),
          card({icon:I.chat, h3:'Clear communication', body:'<p>Consistency and timing from the handler matter as much as anything we do with the dog.</p>'}),
          card({icon:I.bolt, h3:'Beyond commands', body:'<p>We teach the dog how to perform in varied situations, so behavior survives the real world.</p>'})
        ],'grid--two')
      })
    + sec({bg:'cream', body: band({cta:'Schedule Free Meet and Greet'})});
  }
}
