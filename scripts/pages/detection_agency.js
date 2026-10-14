/* Route content for /detection-agency. */
import { SITE } from '../config.js';
import { I, CTAB, CTAC, hero, phero, sec, card, chk, grid, steps, band, faqBlock, FAQS, faqPick, REVIEWS, revBlock } from '../modules/page-shared.js';
export default {title:'Detection Dog Training & K9 Programs for Agencies | Taurus K9, Texas',
  desc:'Contraband and narcotics detection dog training, handler education and department K9 programs. Training days, decoy support and sustainment for police and private teams. Nationwide travel for agency contracts.',
  render(){
    return phero({
      tag:'Detection &amp; Agency Programs',
      title:'Programs for departments, units and private handlers.',
      lede:'Whether you are starting a dog, fixing a handling problem, or maintaining a certified team, we deliver training that is documented, repeatable and defensible in the field.',
      crumbs:[{label:'Home',href:'#/'},{label:'Specialty and Working Dogs',href:'#/working-dogs'},{label:'Detection and Agency'}],
      actions:`<a class="button button--primary" href="#/contact?service=agency">Request Agency Proposal</a>${CTAC}`
    })
    + sec({h2:'Agency and handler services', body: grid([
        card({icon:I.nose, h3:'Detection development', body:'<p>Odor imprinting, search pattern mechanics, indication finalization, and proofing across vehicles, buildings, open area and luggage.</p>'}),
        card({icon:I.chat, h3:'Handler training days', body:'<p>Unit-level training built around your dogs, your handlers and the problems you are actually facing, not a generic curriculum.</p>'}),
        card({icon:I.paw, h3:'Certified decoy support', body:'<p>Scenario pressure delivered to standard, with correct mechanics and safe progression for patrol and protection work.</p>'}),
        card({icon:I.chart, h3:'Sustainment programs', body:'<p>Recurring maintenance to keep certified teams sharp between annual certifications, with documented progress.</p>'}),
        card({icon:I.check, h3:'Selection and procurement', body:'<p>Independent evaluation of candidate dogs so departments invest in the right dog instead of inheriting a problem.</p>'}),
        card({icon:I.shield, h3:'Private handler support', body:'<p>Owner-operators in security, recovery and specialized fields: training and maintenance for working teams outside law enforcement.</p>'})
      ],'grid--two')})
    + sec({
        bg:'cream', eyebrow:'Scope', h2:'How a contract typically runs',
        body: steps([
          {h3:'Needs assessment', p:'A call or visit to define the discipline, the number of teams, current certification status and the outcomes your unit needs.'},
          {h3:'Written proposal', p:'Scope, duration, travel, deliverables and cost. Clear enough to submit internally for approval.'},
          {h3:'Delivery on site', p:'We come to you. Training days, decoy support and handler education delivered against the agreed plan.'},
          {h3:'Documentation and sustainment', p:'Progress records, a maintenance schedule and re-certification support so the capability survives after we leave.'}
        ]) + `<p class="footnote utility--inline-fc511f0c">We travel for agency contracts and quote in all 50 states. Certificate of insurance available on request.</p>`
      })
    + sec({
        eyebrow:'Real-world example', h2:'Contraband detection in a sober living community',
        body:`<div class="measure">
          <p>A recent placement: a contraband (narcotics) detection dog with rock-solid obedience, working periodic sweeps to protect the sanctuary of a residential recovery home. Every sweep adds a layer of accountability, safety and peace of mind for residents.</p>
          <p>What that work looks like: precision narcotics detection on real odors, flawless obedience around real-world distractions, and reward delivered through an indirect reward system on a variable reinforcement schedule. The dog never knows exactly when the reward is coming, because the work itself has become the win.</p>
          <p>If your facility, venue or organization needs detection capability, we build the dog and train the handler.</p>
        </div>`
      })
    + sec({bg:'cream', h2:'Agency questions', body: faqBlock(faqPick([6,5,11,7]))})
    + sec({body: band({h2:'Talk to the working dog division.', p:'Tell us your discipline, your team size and your timeline. We will tell you what is realistic and send a written proposal.', cta:'Request a Proposal'})});
  }
}
