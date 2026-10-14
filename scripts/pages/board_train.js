/* Route content for /board-train. */
import { SITE } from '../config.js';
import { I, CTAB, CTAC, hero, phero, sec, card, chk, grid, steps, band, faqBlock, FAQS, faqPick, REVIEWS, revBlock } from '../modules/page-shared.js';
export default {title:'Board & Train Dog Training in Corpus Christi & South Texas | Taurus K9',
  desc:'Immersive board and train programs in Aransas Pass and Corpus Christi, TX. Basic Obedience (4-6 weeks), Advanced Obedience (6-8 weeks) and Behavior Modification (8-12 weeks) with daily updates and real-world proofing.',
  render(){
    const tiers = [
      {h3:'Basic Obedience', meta:'4&ndash;6 weeks &middot; foundational life skills', flag:'',
       items:['4&ndash;6 week foundational training','Daily updates while your dog stays with us','Advanced commands','Off-leash foundation training','House manners','Training tools available (optional)']},
      {h3:'Advanced Obedience', meta:'6&ndash;8 weeks &middot; public reliability', flag:'Most chosen',
       items:['Everything in Basic Obedience','6&ndash;8 week advanced training','Public reliability proofing','Off-leash training','Public manners in real environments','Training tools available (optional)']},
      {h3:'Behavior Modification', meta:'8&ndash;12 weeks &middot; custom plan', flag:'',
       items:['Everything in Advanced Obedience','8&ndash;12 week intensive program','Custom plan for aggression, anxiety or reactivity','Advanced commands','Off-leash training','Complete manners and household reliability']}
    ].map((t,i) => `<article class="tier${i === 1 ? ' tier--popular' : ''}">
        ${t.flag ? `<span class="tier__flag">${t.flag}</span>` : ''}
        <h3>${t.h3}</h3>
        <p class="tier__meta">${t.meta}</p>
        ${chk(t.items)}
        <p class="tier__price">Quoted per dog after your free meet and greet<span>Written scope and cost before anything starts.</span></p>
        <div class="card__footer">
          <a class="button button--primary button--block" href="#/contact?service=board-train&amp;tier=${encodeURIComponent(t.h3)}" data-track="cta_tier">Reserve My Dog Spot</a>
        </div>
      </article>`).join('');

    return phero({
      tag:'Board &amp; Train',
      title:'While you are at work, your dog is in training.',
      lede:'An immersive residential program where your dog lives with our certified trainers and works multiple structured sessions every day, in real-home and real-world settings, with updates you actually receive.',
      crumbs:[{label:'Home',href:'#/'},{label:'Pet Dog Training',href:'#/pet-training'},{label:'Board & Train'}],
      actions: CTAB + CTAC
    })
    + sec({
        bg:'cream', h2:'Three ways to board and train',
        lede:'Every program includes daily updates, multiple daily sessions across varied settings, and a handoff so the behavior transfers home. Pick the depth that matches your dog.',
        body:`<div class="tiers">${tiers}</div>
          <p class="footnote utility--inline-b700c0fc">Program lengths are the range we quote; final length depends on your dog starting point and your goals. Training tools refers to optional education and conditioning, never required.</p>`
      })
    + sec({
        eyebrow:'Deep dive', h2:'How Board and Train actually works',
        body: grid([
          card({icon:I.bolt, h3:'Accelerated learning', body:'<p>Multiple structured sessions every day, with rest and decompression built in. Consistent repetition across settings compresses months of intermittent training into weeks.</p>'}),
          card({icon:I.home, h3:'Home environment', body:'<p>Training happens in real-home conditions, so your dog generalizes the behavior instead of only performing in a facility.</p>'}),
          card({icon:I.shield, h3:'Certified trainers', body:'<p>Police K9 Master Trainer credentials and years of behavior work mean consistency and a plan, not improvisation.</p>'}),
          card({icon:I.chat, h3:'Progress reporting', body:'<p>Real-time updates and progress reports throughout the stay, the single thing owners tell us they want most.</p>'})
        ],'grid--two')
      })
    + sec({
        bg:'dark', eyebrow:'What to expect', h2:'Your dog stay, start to finish',
        body: steps([
          {h3:'Meet and greet with assessment', p:'Free and in person. We evaluate temperament, existing skills and the specific behaviors you want changed.'},
          {h3:'Plan, scope and quote', p:'You receive the program, the length, whether any training tools are recommended, and the cost, in writing.'},
          {h3:'Training blocks with updates', p:'Daily sessions, varied environments, enrichment and rest. You get progress reports along the way.'},
          {h3:'Handoff and transfer sessions', p:'We teach you the handling and the commands, then follow up so the behavior holds at your house.'}
        ])
      })
    + sec({h2:'Board and Train questions', body: faqBlock(faqPick([2,3,4,9,10]))})
    + sec({bg:'cream', body: band({h2:'Spots are limited. We only board a small number of dogs at a time.', cta:'Reserve My Dog Spot'})});
  }
}
