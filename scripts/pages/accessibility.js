/* Route content for /accessibility. */
import { SITE } from '../config.js';
import { I, CTAB, CTAC, hero, phero, sec, card, chk, grid, steps, band, faqBlock, FAQS, faqPick, REVIEWS, revBlock } from '../modules/page-shared.js';
export default {title:'Accessibility Statement | Taurus K9',
  desc:'Taurus K9 is committed to digital accessibility for all visitors, targeting WCAG 2.2 Level AA conformance on taurusk9.com.',
  render(){
    return phero({title:'Accessibility Statement', lede:'Our commitment to an accessible website for every visitor.', crumbs:[{label:'Home',href:'#/'},{label:'Accessibility'}]})
    + sec({
        body:`<div class="prose">
          <div class="note"><p><strong>Template notice.</strong> Replace bracketed items and confirm your actual audit results before publishing. Accessibility statements must be accurate.</p></div>
          <p><em>Last updated: [DATE]</em></p>
          <h2>Our commitment</h2><p>Taurus K9 is committed to ensuring digital accessibility for people with disabilities. We continually work to improve the experience for everyone and apply the relevant accessibility standards.</p>
          <h2>Standards we target</h2><p>We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA, as well as accessibility requirements applicable under the Americans with Disabilities Act (ADA).</p>
          <h2>Measures we take</h2>
          <ul>
            <li>Semantic HTML with landmark regions, a skip link and a logical heading hierarchy</li>
            <li>Full keyboard operability, including navigation menus, forms and accordions</li>
            <li>Visible focus indicators on all interactive elements</li>
            <li>Text color contrast tested against WCAG AA thresholds</li>
            <li>Form fields with programmatic labels, error identification and instructions</li>
            <li>Respect for the operating system reduced-motion setting</li>
            <li>Alternative text for meaningful images and hidden decorative graphics</li>
            <li>Status messages announced to screen readers</li>
          </ul>
          <h2>Known limitations</h2><p>We are actively improving: [LIST ANY KNOWN ISSUES, such as third-party embedded scheduling widgets or older PDF documents]. We are working with our vendors to resolve them.</p>
          <h2>Third-party content</h2><p>Some features, such as scheduling or review widgets, are provided by third parties and may not fully conform. We provide equivalent contact methods below.</p>
          <h2>Feedback and assistance</h2>
          <p>If you encounter an accessibility barrier, or need information in an alternative format, contact us and we will provide the information through an alternative means:</p>
          <ul>
            <li>Email: <a href="mailto:${SITE.email}">${SITE.email}</a></li>
            <li>Phone: <a href="tel:${SITE.phone}">${SITE.phoneDisplay}</a> (Mon&ndash;Fri, 6:00 AM &ndash; 6:00 PM CT)</li>
          </ul>
          <p>We aim to respond within [X] business days.</p>
          <h2>Assessment approach</h2><p>Accessibility is evaluated through [self-assessment or third-party audit] using [tools and methods]. Last evaluation: [DATE].</p>
        </div>`
      });
  }
}
