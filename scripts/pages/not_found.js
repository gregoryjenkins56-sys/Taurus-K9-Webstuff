/* Route content for /404. */
import { SITE } from '../config.js';
import { I, CTAB, CTAC, hero, phero, sec, card, chk, grid, steps, band, faqBlock, FAQS, faqPick, REVIEWS, revBlock } from '../modules/page-shared.js';
export default {title:'Page Not Found | Taurus K9',
  desc:'That page could not be found. Browse Taurus K9 dog training programs or contact us in Aransas Pass, Texas.',
  render(){
    return phero({
      tag:'404 error',
      title:'That page did not hold the command.',
      lede:'We could not find what you were looking for. Here are the paths people usually want.'
    })
    + sec({body: grid([
        card({icon:I.home, h3:'Pet Dog Training', body:'<p>Board and Train, private lessons, puppy foundations and day training.</p>', foot:'<a class="button button--green button--small" href="#/pet-training">Go to Pet Training</a>'}),
        card({icon:I.shield, h3:'Working Dogs', body:'<p>Detection, police K9, sport, protection and decoy services.</p>', foot:'<a class="button button--green button--small" href="#/working-dogs">Go to Working Dogs</a>'}),
        card({icon:I.chat, h3:'Contact Us', body:`<p>Book a free meet and greet or call ${SITE.phoneDisplay}.</p>`, foot:'<a class="button button--green button--small" href="#/contact">Go to Contact</a>'})
      ],'grid--three')});
  }
}
