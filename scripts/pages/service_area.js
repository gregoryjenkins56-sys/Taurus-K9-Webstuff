/* Route content for /service-area. */
import { SITE } from '../config.js';
import { I, CTAB, CTAC, hero, phero, sec, card, chk, grid, steps, band, faqBlock, FAQS, faqPick, REVIEWS, revBlock } from '../modules/page-shared.js';
export default {title:'Service Area | Dog Training in the Texas Coastal Bend & Nationwide K9 Programs',
  desc:'Taurus K9 serves Aransas Pass, Corpus Christi, Portland, Ingleside, Rockport, Port Aransas, Sinton, Robstown and the Coastal Bend counties, with working dog and agency programs available nationwide.',
  render(){
    const cityList = SITE.cities.map(c => `<li>${c}</li>`).join('');
    const countyList = SITE.counties.map(c => `<li>${c} County</li>`).join('');
    return phero({
      tag:'Service Area',
      title:'Local on the Texas Coast. Nationwide for working dogs.',
      lede:'Our core pet training area is the Coastal Bend, centered on Aransas Pass and Corpus Christi. For working dog and agency programs, we travel, and we quote across the United States.',
      crumbs:[{label:'Home',href:'#/'},{label:'Service Area'}],
      actions: CTAB + CTAC
    })
    + sec({
        eyebrow:'Local', h2:'Cities and towns we serve in the Coastal Bend',
        lede:'If you are within reasonable driving distance of Aransas Pass, contact us and we will confirm availability for your area. Board and Train clients can travel to us.',
        body:`<ul class="areas">${cityList}</ul><h3 class="utility--inline-30e82cb7">Counties</h3><ul class="areas">${countyList}</ul>`
      })
    + sec({
        bg:'cream', eyebrow:'Nationwide', h2:'Agency, department and working dog programs',
        body: grid([
          card({icon:I.shield, h3:'On-site agency delivery', body:'<p>We travel to your department or facility for unit training days, decoy support, handler education and sustainment programs. Proposals are scoped per contract, including travel.</p>'}),
          card({icon:I.nose, h3:'Detection programs anywhere', body:'<p>Detection development, imprinting and certification preparation for departments and private handlers across the United States.</p>'}),
          card({icon:I.chat, h3:'Remote consultations', body:'<p>Not local? We can consult remotely on selection, program design and training problems before committing to travel.</p>'})
        ],'grid--three')
      })
    + sec({h2:'Coverage questions', body: faqBlock(faqPick([7,6,0]))})
    + sec({bg:'cream', body: band({h2:'Not sure if we cover your area? Ask us.', cta:'Check My Area'})});
  }
}
