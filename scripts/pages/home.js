/* Route content for /. */
import { SITE } from '../config.js';
import { I, CTAB, CTAC, hero, phero, sec, card, chk, grid, steps, band, faqBlock, FAQS, faqPick, REVIEWS, revBlock } from '../modules/page-shared.js';
export default {title:'Taurus K9 | Dog Training in Aransas Pass & Corpus Christi, TX',
  desc:'Professional dog training in Aransas Pass, Corpus Christi and the Coastal Bend: Board and Train, private lessons, puppy foundations, behavior modification, detection, sport and police K9 training.',
  render(){
    const trows = [
      {href:'#/pet-training', ic:I.home, t:'Pet Dog Training', d:'Board &amp; Train, private lessons, puppy foundations and day training. Real-world obedience your family can live with.'},
      {href:'#/working-dogs', ic:I.shield, t:'Specialty &amp; Working Dogs', d:'Sport, detection and police K9 training, with certified decoys delivering real-world scenarios.'}
    ].map(x => `<div class="training-row">
        <span class="training-row__icon" aria-hidden="true">${x.ic}</span>
        <div>
          <strong>${x.t}</strong>
          <span>${x.d}</span><br>
          <a href="${x.href}">Explore ${x.t}</a>
        </div>
      </div>`).join('');

    return hero({
      tag:'We make "sit" happen.',
      title:'Dog training that holds up in the real world.',
      lede:'Taurus K9 trains family pets and professional working dogs across the Texas Coastal Bend. Structured plans, daily updates, certified trainers, and a free meet and greet so you can decide with no pressure.',
      actions:`${CTAB}<a class="button button--outline" href="#/pet-training">See all programs</a>`,
      mini:['Free in-person meet and greet','Certified Police K9 Master Trainers','Daily progress updates','Agency and department programs'],
      aside:`<aside class="home-card" aria-labelledby="hcH">
        <h2 id="hcH">Which path is your dog on?</h2>
        ${trows}
        <p>Not sure? The free meet and greet settles it in person.</p>
      </aside>`
    })
    + sec({bg:'cream', body:`<div class="strip">
        <div><b>Police K9 Master Trainer</b><span>Tarheel Canine Inc. certified</span></div>
        <div><b>NEPOPO Silver School</b><span>Graduate trainers</span></div>
        <div><b>Decoy Level 1</b><span>Demanet Academy certified</span></div>
        <div><b>21 Years</b><span>U.S. Army veteran on staff</span></div>
      </div>`})
    + sec({
        eyebrow:'Two Trainers, one standard',
        h2:'Pet dogs and working dogs. Same trainers, same rigor.',
        lede:'Whether your dog needs to stop jumping on guests or needs to certify as a K9 team, the process starts the same way: assess the individual dog, build a plan, set that dog up to succeed.',
        body: grid([
          card({
            icon:I.home, tag:'Pet owners', h3:'Pet Dog Training',
            body:`<p>For families who want a dog that is genuinely easy to live with, not one that behaves only in a training building.</p>
              ${chk(['Board &amp; Train (4&ndash;12 weeks)','Private one-on-one lessons','Puppy Foundations from 8 weeks','Behavior modification for reactivity, anxiety and aggression'])}`,
            foot:`<a class="button button--green button--small" href="#/pet-training">Explore Pet Training</a>`
          }),
          card({
            icon:I.shield, acc:true, tag:'Handlers and agencies', h3:'Specialty &amp; Working Dog Training',
            body:`<p>For handlers, departments and owner-operators who need documented, repeatable performance under real pressure.</p>
              ${chk(['Sport protection and tracking','Contraband and narcotics detection','Police K9 and patrol support','Certified police decoy scenario work'])}`,
            foot:`<a class="button button--green button--small" href="#/working-dogs">Explore Working Dogs</a>`
          })
        ],'grid--two')
      })
    + sec({
        bg:'dark', eyebrow:'How it works', h2:'Four steps from first call to a trained dog',
        lede:'No guesswork and no surprise invoices. You always know which stage you are in and what comes next.',
        body: steps([
          {h3:'Free meet and greet', p:'In person, no cost, no commitment. We assess temperament, environment and goals, then tell you what is realistic.'},
          {h3:'A written plan and quote', p:'You get the recommended program, the length, any training tools, and the cost in writing before anything starts.'},
          {h3:'Training with daily updates', p:'Board and Train runs multiple structured sessions daily across varied settings. Lessons run in your home and neighborhoods.'},
          {h3:'Handoff and follow-through', p:'We hand you the handling skills, not just a trained dog, plus a maintenance plan and trainer support.'}
        ])
      })
    + sec({
        eyebrow:'Why clients choose us', h2:'What certified actually means here',
        lede:'Anyone can call themselves a dog trainer. These are the credentials you can verify before you hand over your dog.',
        body: grid([
          card({icon:I.chart, h3:'Temperament-first assessment', body:'<p>Our approach centers on understanding the individual temperament of each dog and building a strategy rooted in scientific principles, not a template applied to every dog.</p>'}),
          card({icon:I.paw, h3:'Low-stress, motivational methods', body:'<p>We use motivational techniques so your dog learns with minimal stress. A dog that is not shut down learns faster and keeps the behavior longer.</p>'}),
          card({icon:I.bolt, h3:'Real-world proofing', body:'<p>Skills are trained in varied settings: home, parks, parking lots and public spaces, so reliability survives contact with the real world.</p>'}),
          card({icon:I.chat, h3:'You are trained too', body:'<p>A dog that is only obedient for the trainer is not trained. Handoff includes handler education so the results stay yours.</p>'})
        ],'grid--four')
      })
    + sec({
        bg:'cream', eyebrow:'Credentials & standards', h2:'Trained by certified professionals',
        body:`<p class="utility--inline-561f378b">Every program is built and delivered by trainers with recognized law enforcement and working-dog credentials.</p>
          ${grid([
            `<article class="card"><h3>Police K9 Master Trainer</h3>
              <p><strong>Tarheel Canine Inc.</strong></p>
              <p>Advanced training in patrol, detection and handler development for working dog teams.</p></article>`,
            `<article class="card"><h3>NEPOPO Silver School</h3>
              <p><strong>Graduate</strong></p>
              <p>Completed a nationally recognized police K9 school with a standards-based curriculum.</p></article>`,
            `<article class="card"><h3>Police Decoy Level 1</h3>
              <p><strong>Demanet Academy</strong></p>
              <p>Certified decoy work that gives dogs safe, realistic scenario training.</p></article>`
          ],'grid--three')}
          <p class="utility--inline-fc511f0c"><a class="button button--outline button--small" href="#/about">Meet the trainers</a></p>`
      })
    + sec({body: band({})});
  }
}
