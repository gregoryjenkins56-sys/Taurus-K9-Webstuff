/* Route content for /day-training. */
import { SITE } from '../config.js';
import { I, CTAB, CTAC, hero, phero, sec, card, chk, grid, steps, band, faqBlock, FAQS, faqPick, REVIEWS, revBlock } from '../modules/page-shared.js';
export default {title:'Day Training for Dogs in Corpus Christi & the Coastal Bend | Taurus K9',
  desc:'Trainer-led day training sessions for dogs in Aransas Pass, Corpus Christi and the Coastal Bend. Structured daytime training with transfer sessions so handling skills become yours.',
  render(){
    return phero({
      tag:'Day Training',
      title:'Your dog trains during the day. You get the skills at handoff.',
      lede:'Day training fits training into the hours you are already working. A certified trainer runs structured sessions with your dog, then teaches you the handling so the results transfer home.',
      crumbs:[{label:'Home',href:'#/'},{label:'Pet Dog Training',href:'#/pet-training'},{label:'Day Training'}],
      actions: CTAB + CTAC
    })
    + sec({h2:'Who day training suits', body: grid([
        card({icon:I.clock, h3:'Working owners', body:'<p>If your schedule is the only thing standing between your dog and consistent training, day training removes that obstacle.</p>'}),
        card({icon:I.bolt, h3:'Dogs needing repetition', body:'<p>Some dogs need far more repetition than a weekly lesson provides. Daily or multi-weekly sessions accelerate progress substantially.</p>'}),
        card({icon:I.chat, h3:'Owners who want to stay involved', body:'<p>Unlike Board and Train, your dog comes home each day. Transfer sessions keep you part of the process.</p>'})
      ],'grid--three')})
    + sec({bg:'cream', h2:'Day training questions', body: faqBlock(faqPick([0,9,1]))})
    + sec({body: band({cta:'Ask About Day Training'})});
  }
}
