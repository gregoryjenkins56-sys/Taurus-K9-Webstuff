/* Route content for /privacy. */
import { SITE } from '../config.js';
import { I, CTAB, CTAC, hero, phero, sec, card, chk, grid, steps, band, faqBlock, FAQS, faqPick, REVIEWS, revBlock } from '../modules/page-shared.js';
export default {title:'Privacy Policy | Taurus K9',
  desc:'How Taurus K9 collects, uses and protects personal information submitted through taurusk9.com, including SMS consent, analytics and your privacy rights.',
  render(){
    return phero({title:'Privacy Policy', lede:'How we handle the information you give us.', crumbs:[{label:'Home',href:'#/'},{label:'Privacy Policy'}]})
    + sec({
        body:`<div class="prose">
          <div class="note"><p><strong>Template notice.</strong> This policy is a complete, usable starting draft written to US standards. Have it reviewed by qualified counsel and confirm it matches your actual tools (CRM, analytics, call tracking) before publishing. Replace bracketed placeholders.</p></div>
          <p><em>Last updated: [DATE]</em></p>
          <h2>Who we are</h2><p>Taurus K9 operates www.taurusk9.com and provides dog training services from Aransas Pass, Texas. Contact us at <a href="mailto:${SITE.email}">${SITE.email}</a> or <a href="tel:${SITE.phone}">${SITE.phoneDisplay}</a>.</p>
          <h2>Information we collect</h2>
          <ul>
            <li><strong>Information you give us:</strong> name, email, phone number, city, your dog name, breed, age, the service you are interested in, your message and your communication preferences.</li>
            <li><strong>Automatically collected:</strong> IP address, device and browser type, pages viewed, referring URL and campaign parameters such as UTM codes and click identifiers used to understand how visitors find us.</li>
            <li><strong>Communications:</strong> records of calls, emails and text messages so we can follow up accurately.</li>
          </ul>
          <h2>How we use information</h2>
          <ul>
            <li>Respond to your inquiry and schedule your consultation</li>
            <li>Deliver the training services you book</li>
            <li>Send service updates, appointment reminders and, only with your consent, marketing messages</li>
            <li>Improve our website, programs and advertising</li>
            <li>Meet legal, insurance and accounting obligations</li>
          </ul>
          <h2>Text messages and calls</h2>
          <p>If you provide a phone number and check the consent box, you agree that Taurus K9 may contact you by call or text at that number, including through automated technology, about your inquiry and our services. Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. Reply <strong>STOP</strong> to unsubscribe or <strong>HELP</strong> for help at any time.</p>
          <h2>Cookies and tracking</h2>
          <p>We use cookies and similar technologies. Essential cookies keep the site functioning. Analytics and marketing cookies are optional and are only set with your consent through our cookie banner. You can change your choice at any time using Cookie Settings in the footer. We may use Google Analytics 4, Google Ads, Meta advertising tools and call-tracking services.</p>
          <h2>Sharing</h2>
          <p>We do not sell your personal information. We share it only with service providers who help us operate, such as our CRM and email provider, hosting, analytics and scheduling tools; with professional advisors; or where required by law or to protect safety. Where a dog is placed with a department or facility, we may share relevant records with that organization.</p>
          <h2>Data retention</h2>
          <p>We keep inquiry and client records as long as needed to provide services and meet legal and insurance requirements, then delete or anonymize them.</p>
          <h2>Your rights</h2>
          <p>Depending on your state of residence, you may have the right to request access to, correction of, or deletion of your personal information, and to opt out of certain uses. To make a request, email <a href="mailto:${SITE.email}">${SITE.email}</a>. We will verify your request and respond within the timeframe required by applicable law.</p>
          <h2>Children</h2><p>Our services and website are intended for adults. We do not knowingly collect information from children under 13.</p>
          <h2>Security</h2><p>We use reasonable administrative, technical and physical safeguards, including encrypted transmission over HTTPS. No method of transmission or storage is completely secure.</p>
          <h2>Changes</h2><p>We may update this policy. Material changes will be posted on this page with a new effective date.</p>
          <h2>Contact</h2><p>Taurus K9 &middot; Aransas Pass, TX 78336 &middot; <a href="mailto:${SITE.email}">${SITE.email}</a> &middot; <a href="tel:${SITE.phone}">${SITE.phoneDisplay}</a></p>
        </div>`
      });
  }
}
