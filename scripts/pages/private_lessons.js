/* Route content for /private-lessons. */
import { SITE } from '../config.js';
import { I, CTAB, CTAC, hero, phero, sec, card, chk, grid, steps, band, faqBlock, FAQS, faqPick, REVIEWS, revBlock } from '../modules/page-shared.js';
export default {title:'Private Dog Training Lessons in Corpus Christi & the Coastal Bend | Taurus K9',
  desc:'One-on-one private dog training lessons in your home and neighborhoods across Aransas Pass, Corpus Christi and the Coastal Bend. Customized to your goals, with handling skills for the owner.',
  render(){
    return phero({
      tag:'Private Lessons',
      title:'One-on-one training, built around your dog and your goals.',
      lede:'Some dogs need the training, some owners need the handling skills, and most need both. Private lessons put a certified trainer alongside you in your own environment, coaching the timing and communication that actually changes behavior.',
      crumbs:[{label:'Home',href:'#/'},{label:'Pet Dog Training',href:'#/pet-training'},{label:'Private Lessons'}],
      actions: CTAB + CTAC
    })
    + sec({
        h2:'What private lessons cover',
        lede:'Lessons are customized, not scripted. These are the most common goals clients bring us.',
        body: grid([
          card({icon:I.paw, h3:'Foundational obedience', body: chk(['Sit, down, stay, place','Loose-leash walking','Coming when called','Door and threshold manners'])}),
          card({icon:I.bolt, h3:'Real-world reliability', body: chk(['Public manners and neutrality','Polite greetings with people and dogs','Off-leash reliability where appropriate','Working around distractions'])}),
          card({icon:I.shield, h3:'Behavior problems', body: chk(['Jumping, nipping, counter-surfing','Leash reactivity and barking','Anxiety and settling difficulty','Aggression, assessed first and managed honestly'])}),
          card({icon:I.chat, h3:'Owner handling skills', body: chk(['Marker timing and reward placement','Reading body language and stress signals','Consistent household rules','Crate and management strategy'])})
        ],'grid--two')
      })
    + sec({
        bg:'cream', eyebrow:'Format', h2:'Where and how lessons run',
        body: grid([
          card({h3:'In your home', body:'<p>Sessions where the behavior actually happens. Especially valuable for door manners, crate work and household structure.</p>'}),
          card({h3:'In your neighborhood', body:'<p>We train on your streets, parks and parking lots so the dog generalizes instead of performing only at home.</p>'}),
          card({h3:'Single sessions or packages', body:'<p>Start with one session to see if we are the right fit, or commit to a package for a defined goal and timeline.</p>'})
        ],'grid--three')
      })
    + sec({h2:'Private lesson questions', body: faqBlock(faqPick([1,2,8,9]))})
    + sec({bg:'cream', body: band({h2:'Book a private lesson or start with the free meet and greet.', cta:'Book Free Meet and Greet'})});
  }
}
