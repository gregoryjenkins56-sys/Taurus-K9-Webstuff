/* Route content for /working-dogs. */
import { SITE } from '../config.js';
import { I, CTAB, CTAC, hero, phero, sec, card, chk, grid, steps, band, faqBlock, FAQS, faqPick, REVIEWS, revBlock } from '../modules/page-shared.js';
export default {title:'Police K9, Detection, Sport & Protection Dog Training in Texas | Taurus K9',
  desc:'Specialty and working dog training in Texas: sport protection, tracking, contraband and narcotics detection, police K9, patrol support and certified police decoy scenario training. Agency programs nationwide.',
  render(){
    return phero({
      tag:'Specialty &amp; Working Dog Training',
      title:'Working dogs trained for real scenarios, not demonstrations.',
      lede:'Taurus K9 trains sport, detection and police K9 teams, with experienced certified police decoys providing real-world scenario work that prepares the dog for peak performance under pressure.',
      crumbs:[{label:'Home',href:'#/'},{label:'Specialty and Working Dogs'}],
      actions: CTAB + `<a class="button button--outline" href="#/detection-agency">Agency programs</a>`
    })
    + sec({id:'sport', h2:'Disciplines we train', body: grid([
        card({icon:I.shield, tag:'Sport', h3:'Sport training',
          body:`<p>Structured development for sport handlers: obedience under drive, protection phases, tracking and precision, built progressively with clear benchmarks.</p>
            ${chk(['Obedience under high drive','Protection phase development','Tracking and scent discrimination','Trial preparation and problem-solving'])}`}),
        card({icon:I.nose, acc:true, tag:'Detection', h3:'Detection dogs',
          body:`<p>Odor imprinting and search pattern development for narcotics, contraband and other target odors, including vehicle, building and area searches.</p>
            ${chk(['Odor imprinting and indication','Vehicle, building and area search','Indirect reward and variable reinforcement','Handler education and certification prep'])}`,
          foot:`<a class="button button--green button--small" href="#/detection-agency">Detection programs</a>`}),
        card({icon:I.chat, tag:'Police K9', h3:'Police K9 training',
          body:`<p>Patrol and dual-purpose development, handler education and sustainment training for departments already working a dog.</p>
            ${chk(['Patrol and dual-purpose development','Handler and unit training days','Sustainment and re-certification support','Scenario-based team evaluation'])}`}),
        card({icon:I.bolt, acc:true, id:'protection', tag:'Civilian', h3:'Personal protection',
          body:`<p>For owners who want a trained family dog with reliable protective capability. Every dog and family is assessed individually; this is not the right fit for everyone, and we will say so.</p>
            ${chk(['Obedience first, always','Controlled protective response','Family-safe handling protocols','Clear legal and liability guidance'])}`}),
        card({icon:I.paw, tag:'Support', h3:'Certified police decoy services',
          body:`<p>Scenario work delivered by Demanet Academy Police Decoy Level 1 certified decoys: realistic pressure that builds a working dog instead of confusing it.</p>
            ${chk(['Real-world scenario pressure','Correct decoy mechanics','Safe, controlled progression','Unit-level training support'])}`}),
        card({icon:I.check, tag:'Selection', h3:'Dog evaluation and selection',
          body:`<p>Temperament, drive, nerve and suitability assessment before you invest in a working dog or a long program.</p>
            ${chk(['Temperament and nerve evaluation','Drive and hunt assessment','Suitability for discipline','Honest pass or fail reporting'])}`})
      ],'grid--two')})
    + sec({
        bg:'dark', eyebrow:'Our credentials', h2:'Certifications behind the working dog division',
        lede:'These are the qualifications we can document. Verify them before you hire any working dog trainer.',
        body: grid([
          card({h3:'Tarheel Canine Inc.', body:'<p><strong>Police K9 Master Trainer</strong> certification held by both Greg and Rebecca.</p>'}),
          card({h3:'NEPOPO Silver School', body:'<p>Silver School graduates, covering detection and working dog development methodology.</p>'}),
          card({h3:'Demanet Academy', body:'<p><strong>Police Decoy Level 1</strong> certification for realistic, safe scenario work.</p>'}),
          card({h3:'21 years U.S. Army', body:'<p>Greg brings two decades of military discipline and operational experience to the training field.</p>'})
        ],'grid--two')
      })
    + sec({
        eyebrow:'Training philosophy', h2:'Understanding the dog before writing the plan',
        body:`<div class="measure">
          <p>Our approach centers on comprehending the unique temperament of each dog and devising a training strategy rooted in scientific principles to achieve the ultimate training objective effectively.</p>
          <p>We employ motivational techniques to ensure the dog learns with minimal stress, going well beyond mere command teaching to instill a broader understanding of how to perform in various situations. Our guiding principle is to create an environment where the dog is primed for success.</p>
          <p>For detection work specifically, that means building reinforcement schedules the right way: indirect reward on a variable schedule, so the dog works because the behavior itself has become the win, not because a treat is visible in the handler hand. Behavior reinforced on a variable schedule is the most resistant to extinction, which is exactly what you want in the field.</p>
        </div>
        <h3 id="decoy" class="utility--inline-aeb32f6a">Decoy services</h3>
        <div class="measure"><p>Scenario work is only as good as the decoy delivering it. Our decoy support is certified, safety-managed, and matched to your dog current level, building the dog up rather than overwhelming it.</p></div>`
      })
    + sec({bg:'cream', h2:'Working dog questions', body: faqBlock(faqPick([5,6,4,11]))})
    + sec({body: band({h2:'Working dog or agency program? Request a proposal.', cta:'Request a Proposal'})});
  }
}
