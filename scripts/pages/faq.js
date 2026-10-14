/* Route content for /faq. */
import { SITE } from '../config.js';
import { I, CTAB, CTAC, hero, phero, sec, card, chk, grid, steps, band, faqBlock, FAQS, faqPick, REVIEWS, revBlock } from '../modules/page-shared.js';
export default {title:'Dog Training FAQ | Taurus K9, Aransas Pass & Corpus Christi TX',
  desc:'Answers about Taurus K9 dog training: methods, e-collar education, Board and Train lengths, updates, working dog programs, service area, pricing, and what happens at the free meet and greet.',
  render(){
    return phero({
      tag:'FAQ',
      title:'Answers before you hand over your dog.',
      lede:'The questions we get asked most, answered the same way we would answer them on the phone.',
      crumbs:[{label:'Home',href:'#/'},{label:'FAQ'}],
      actions: CTAB + CTAC
    })
    + sec({body: faqBlock(FAQS)})
    + sec({bg:'cream', body: band({h2:'Still have a question? Call us.', cta:'Book Free Meet and Greet'})});
  }
}
