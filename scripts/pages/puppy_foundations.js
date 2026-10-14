/* Route content for /puppy-foundations. */
import { SITE } from '../config.js';
import { I, CTAB, CTAC, hero, phero, sec, card, chk, grid, steps, band, faqBlock, FAQS, faqPick, REVIEWS, revBlock } from '../modules/page-shared.js';
export default {title:'Puppy Training in Aransas Pass & Corpus Christi, TX | Taurus K9',
  desc:'Puppy training from 8 weeks in the Texas Coastal Bend. Socialization, handling, crate and potty routines, and a confident foundation that prevents behavior problems later.',
  render(){
    return phero({
      tag:'Puppy Foundations',
      title:'The behavior you build at 10 weeks lasts a lifetime.',
      lede:'The easiest dog to train is a puppy who has not learned the wrong habits yet. We build socialization, handling tolerance and household routines while your puppy is still in the highest-learning window.',
      crumbs:[{label:'Home',href:'#/'},{label:'Pet Dog Training',href:'#/pet-training'},{label:'Puppy Foundations'}],
      actions: CTAB + CTAC
    })
    + sec({h2:'What we build in puppies', body: grid([
        card({icon:I.paw, h3:'Socialization done properly', body: chk(['Confident exposure to people, surfaces and sounds','Reading your puppy stress signals','Exposure without overwhelming','Building neutrality rather than over-excitement'])}),
        card({icon:I.home, h3:'Household routines', body: chk(['Crate introduction and comfort','Potty schedule and management','Bite inhibition and appropriate chewing','Settling and calm behavior indoors'])}),
        card({icon:I.check, h3:'Foundation commands', body: chk(['Name recognition and focus','Sit, down, come, place','Leash introduction without pulling','Building the habit of learning'])}),
        card({icon:I.chat, h3:'Owner education', body: chk(['What to do at each developmental stage','Preventing resource guarding','Managing children and puppy interactions','A clear plan for the next 6 months'])})
      ],'grid--two')})
    + sec({bg:'cream', h2:'Puppy questions', body: faqBlock(faqPick([8,0,1]))})
    + sec({body: band({h2:'Start your puppy on the right foundation.', cta:'Book Free Meet and Greet'})});
  }
}
