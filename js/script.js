/* =========================================================
   TAURUS K9 - SITE SCRIPT
   All HTML is generated with template literals. No string
   concatenation, so quotes and parentheses cannot break.
   ========================================================= */

const SITE = {
  phoneDisplay:'361-230-1932',
  phone:'+13612301932',
  email:'taurusk9tx@gmail.com',
  city:'Aransas Pass', state:'TX', zip:'78336',
  origin:'https://www.taurusk9.com',
  bookingUrl:'https://www.taurusk9.com/meetings/taurus',
  cities:['Aransas Pass','Corpus Christi','Portland','Ingleside','Rockport','Fulton','Port Aransas','Gregory','Sinton','Odem','Taft','Mathis','Robstown','Bishop','Kingsville','Alice','Beeville','Refugio','Woodsboro','Skidmore','Orange Grove','Freer','Premont'],
  counties:['San Patricio','Nueces','Aransas','Refugio','Kleberg','Jim Wells','Bee','Live Oak'],
  hours:[['Monday - Friday','6:00 AM - 6:00 PM'],['Saturday','By appointment'],['Sunday','By appointment']]
};

const I = {
  paw:`<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><ellipse cx="7" cy="7.5" rx="2.4" ry="3"/><ellipse cx="12" cy="6.2" rx="2.4" ry="3.1"/><ellipse cx="17" cy="7.5" rx="2.4" ry="3"/><path d="M12 11.2c3 0 5.4 2 5.4 4.6 0 2-1.7 3.2-3.6 3.2-1 0-1.4-.3-1.8-.3s-.8.3-1.8.3c-1.9 0-3.6-1.2-3.6-3.2 0-2.6 2.4-4.6 5.4-4.6Z"/></svg>`,
  shield:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7.5 3v6c0 5.2-3.4 8.4-7.5 10-4.1-1.6-7.5-4.8-7.5-10V6L12 3Z"/><path d="M9.2 12.2l2 2 3.6-4"/></svg>`,
  home:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/></svg>`,
  user:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><circle cx="12" cy="6" r="3.2"/></svg>`,
  nose:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4c3.6 0 6 2.3 6 5.2 0 2.3-1.6 3.6-2.8 4.6-.9.8-1.2 1.5-1.2 2.4 0 1.3-.9 2.3-2 2.3s-2-1-2-2.3c0-.9-.3-1.6-1.2-2.4C7.6 12.8 6 11.5 6 9.2 6 6.3 8.4 4 12 4Z"/><path d="M9.5 9.5c.4.9 1.4 1.5 2.5 1.5s2.1-.6 2.5-1.5"/></svg>`,
  bolt:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/></svg>`,
  chart:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>`,
  chat:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 1 1-3.2-6.4"/><path d="M4 20l3.8-1.2"/></svg>`,
  clock:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.4 2"/></svg>`,
  pin:`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C4.7 0 2 2.7 2 6c0 4.2 6 10 6 10s6-5.8 6-10c0-3.3-2.7-6-6-6Zm0 8.3A2.3 2.3 0 1 1 8 3.7a2.3 2.3 0 0 1 0 4.6Z"/></svg>`,
  phone:`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.6 1.4 5.5 1c.4-.1.8.1 1 .5l.8 2a.9.9 0 0 1-.2 1L6 5.9a8.7 8.7 0 0 0 4.1 4.1l1.4-1.1a.9.9 0 0 1 1-.2l2 .8c.4.2.6.6.5 1l-.4 1.9c-.1.4-.4.7-.8.7A12.4 12.4 0 0 1 2.9 2.2c0-.4.3-.7.7-.8Z"/></svg>`,
  mail:`<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M1.5 3.5h13v9h-13v-9Zm1.3 1 .2.1L8 8.1l4.8-3.5.2-.1H2.8Z"/></svg>`,
  check:`<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm3.6 6.2-4.2 4.6a.9.9 0 0 1-1.3 0L4.4 9a.9.9 0 0 1 1.3-1.3l1 1 3.6-4a.9.9 0 1 1 1.3 1.3Z"/></svg>`
};

/* ---------- shared building blocks ---------- */

const CTAB = `<a class="btn btn-p" href="#/contact" data-track="cta_book">Book Free Meet &amp; Greet</a>`;
const CTAC = `<a class="btn btn-o" href="tel:${SITE.phone}" data-track="click_to_call" data-loc="hero">Call ${SITE.phoneDisplay}</a>`;

function crumbs(items){
  if(!items || !items.length) return '';
  const li = items.map((c,i) => (c.href && i < items.length - 1)
    ? `<li><a href="${c.href}">${c.label}</a></li>`
    : `<li><span aria-current="page">${c.label}</span></li>`).join('');
  return `<nav class="crumbs wrap" aria-label="Breadcrumb"><ol>${li}</ol></nav>`;
}

function hero(o){
  const mini = (o.mini || []).map(m => `<li>${I.check} ${m}</li>`).join('');
  return `<section class="hero hero--video">
    <video class="hero__video" autoplay muted loop playsinline>
       <source src="https://242184033.fs1.hubspotusercontent-na2.net/hubfs/242184033/Videos/Facebook%20Test%20Video.mp4" type="video/mp4">
    </video>
    <div class="hero__overlay"></div>
    ${o.crumbs ? crumbs(o.crumbs) : ''}
  <div class="wrap hero__in">
    <div>
      ${o.tag ? `<span class="tagpill">${o.tag}</span>` : ''}
      <h1>${o.title}</h1>
      <p class="lede">${o.lede}</p>
      ${o.actions ? `<div class="btnrow" style="margin:1.5rem 0 1rem">${o.actions}</div>` : ''}
      ${mini ? `<ul class="hero__min">${mini}</ul>` : ''}
    </div>
    ${o.aside || ''}
  </div></section>`;
}

function phero(o){
    return `<section class="phero${o.video ? ' phero--video' : ''}">
    ${o.video ? `<video class="phero__video" autoplay muted loop playsinline aria-hidden="true"><source src="${o.video}" type="video/mp4"></video>` : ''}
    ${crumbs(o.crumbs)}<div class="wrap phero__in">
    ${o.tag ? `<span class="tagpill">${o.tag}</span>` : ''}
    <h1>${o.title}</h1>
    <p class="lede">${o.lede}</p>
    ${o.actions ? `<div class="btnrow" style="margin-top:1.4rem">${o.actions}</div>` : ''}
  </div></section>`;
}

function sec(o){
  return `<section class="section ${o.bg === 'dark' ? 's-dark' : (o.bg === 'cream' ? 's-cream' : 's-surface')}${o.centerIntro ? ' center-intro' : ''}${o.centerLede ? ' center-lede' : ''}">
    <div class="wrap">
      ${o.eyebrow ? `<span class="eyebrow">${o.eyebrow}</span>` : ''}
      ${o.h2 ? `<h2>${o.h2}</h2>` : ''}
      ${o.lede ? `<p class="lede">${o.lede}</p>` : ''}
      ${o.body || ''}
    </div></section>`;
}

function card(o){
  return `<article class="card${o.acc ? ' card-acc' : ''}"${o.id ? ` id="${o.id}"` : ''}>
    ${o.icon || o.tag || o.step ? `<div class="card__head">
      ${o.icon ? `<span class="card__ic" aria-hidden="true">${o.icon}</span>` : ''}
      ${o.step ? `<span class="card__ic card__step" aria-hidden="true">${o.step}</span>` : ''}
      ${o.tag ? `<span class="tag${o.acc ? ' tag-b' : ''}">${o.tag}</span>` : ''}
    </div>` : ''}
    <h3>${o.h3}</h3>
    ${o.body || ''}
    ${o.foot ? `<div class="card__f">${o.foot}</div>` : ''}
  </article>`;
}
const chk = items => `<ul class="check">${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
const grid = (items, cls) => `<div class="grid ${cls}">${items.join('')}</div>`;

const steps = items => `<ol class="steps">${items.map(s => `<li><h3>${s.h3}</h3><p>${s.p}</p></li>`).join('')}</ol>`;

function band(o){
  o = o || {};
  const h2 = o.h2 || 'Let’s find the right next step for your dog.';
  const p = o.p || 'Meet the trainers, talk through your goals and get an honest recommendation. The in-person meet and greet is free, with no obligation.';
  const cta = o.cta || 'Schedule a Free Meet &amp; Greet';
  return `<div class="band"><div><h2>${h2}</h2><p>${p}</p></div>
    <div class="btnrow">
      <a class="btn btn-p" href="#/contact" data-track="cta_band_book">${cta}</a>
      <a class="btn btn-o" href="tel:${SITE.phone}" data-track="click_to_call" data-loc="cta_band">Call ${SITE.phoneDisplay}</a>
    </div></div>`;
}

const faqBlock = items => `<div class="faq">${items.map(q => `<details class="q"><summary>${q.q}</summary><div class="qbody">${q.a}</div></details>`).join('')}</div>`;

const revBlock = r => `<figure class="review">
  <div class="stars" role="img" aria-label="${r.stars} out of 5 stars">${'\u2605'.repeat(r.stars)}</div>
  <blockquote>${r.text}</blockquote>
  <figcaption><b>${r.name}</b>${r.detail}</figcaption>
</figure>`;

/* PLACEHOLDER REVIEWS - replace with verified Google and Facebook reviews before launch */
const REVIEWS = [
  {stars:5,name:'Client name',detail:'Corpus Christi, TX &middot; Board &amp; Train, Basic Obedience',text:'Placeholder for a verified Google or Facebook review. Paste the real review text here, with the reviewer name and permission.'},
  {stars:5,name:'Client name',detail:'Aransas Pass, TX &middot; Private Lessons',text:'Placeholder for a verified review. Keep it specific to the program named in the caption so future clients can match their situation.'},
  {stars:5,name:'Client name',detail:'Rockport, TX &middot; Behavior Modification',text:'Placeholder for a verified review. Behavior modification reviews are the highest-intent social proof for this service line.'},
  {stars:5,name:'Agency or handler',detail:'Detection &amp; Police K9',text:'Placeholder for a verified review from a working dog or agency client. These build credibility with departments evaluating contracts.'}
];

const FAQS = [
  {q:'What happens at a free meet and greet?',a:'<p>You meet the trainers, and we get to know you and your dog. We talk through your dog’s temperament, history, home life and your goals, then recommend a program and realistic timeline. It is in person, free and pressure-free—you will get a clear answer, not a sales pitch.</p>'},
  {q:'How do you train dogs?',a:'<p>We start by learning who your dog is, then build a plan around their temperament and your goals. Training uses motivation, positive reinforcement and clear, consistent communication to keep learning low-stress. We want skills to work in everyday situations—not just when a command is practiced.</p>'},
  {q:'Do you use e-collars?',a:'<p>Tool education is optional. If an e-collar is part of your dog’s plan, we introduce it gradually through conditioning and teach you how to use it safely and clearly. We also offer education sessions for owners and teams who want to understand these tools. You never have to use one.</p>'},
  {q:'How long does Board &amp; Train take?',a:'<p>There are three tracks: <strong>Basic Obedience</strong> (4&ndash;6 weeks) for everyday skills and off-leash foundations; <strong>Advanced Obedience</strong> (6&ndash;8 weeks) for reliability in public and off leash; and <strong>Behavior Modification</strong> (8&ndash;12 weeks) for a tailored approach to aggression, anxiety or reactivity. Each includes structured daily sessions, regular updates and practice in real-world settings.</p>'},
  {q:'Will you keep me updated while my dog is with you?',a:'<p>Yes. You will receive progress updates throughout your dog’s stay, then work with the trainer at handoff to carry those skills into life at home.</p>'},
  {q:'Do you train working dogs as well as family dogs?',a:'<p>Yes. We train family dogs, sport and detection dogs, and police K9 teams. Our certified decoys also provide real-world scenario training. Greg and Rebecca hold Police K9 Master Trainer credentials through Tarheel Canine Inc. and are NEPOPO Silver School graduates; Greg holds Demanet Academy Police Decoy Level 1 certification.</p>'},
  {q:'Do you work with law enforcement agencies?',a:'<p>Yes. We offer unit training days, decoy support, handler education and ongoing team development. We travel for agency contracts, so departments beyond the Coastal Bend can request a proposal.</p>'},
  {q:'Where do you provide training?',a:'<p>We serve Aransas Pass, Corpus Christi, Portland, Ingleside, Rockport, Port Aransas, Sinton, Robstown and nearby Coastal Bend communities. For working dog and agency programs, we travel and can provide proposals across the United States.</p>'},
  {q:'When can my puppy start training?',a:'<p>Puppies can start Puppy Foundations at 8 weeks. Early training focuses on socialization, handling, household routines and the everyday skills that help set your puppy up for success.</p>'},
  {q:'How much does training cost?',a:'<p>Every dog and program is different, so we provide an individual quote after the meet and greet. The consultation is free, and you will have the program scope and price in writing before you decide.</p>'},
  {q:'Can you help a dog with a bite history or serious aggression?',a:'<p>We assess these cases carefully and give you an honest recommendation. Some dogs need a custom behavior plan and more time; others may benefit from working alongside a veterinary behaviorist. We will explain what we believe is appropriate before recommending a program.</p>'},
  {q:'Do you carry insurance?',a:'<p>Yes. Taurus K9 carries business insurance. We can provide a current certificate of insurance on request for agency or facility contracts.</p>'}
];

const faqPick = idx => idx.map(i => FAQS[i]);

/* ---------- lead form (CRM) ---------- */

function leadForm(){
  return `<form class="form" id="leadForm" novalidate>
  <div class="errm" id="errm" role="alert" data-show="false" tabindex="-1">
    <h3>Let’s take care of a few details</h3>
    <ul id="errList"></ul>
  </div>
  <input class="hp" type="text" name="company" tabindex="-1" autocomplete="off" aria-hidden="true" />

  <fieldset>
    <legend class="fl-legend">What would you like help with? <span class="req" aria-hidden="true">*</span></legend>
    <p class="hint">Choose the closest fit. We can talk through the details together.</p>
    <div class="field" style="margin-top:.85rem">
      <label for="service">Training service</label>
      <select id="service" name="service" required aria-describedby="serviceErr">
        <option value="">Select a service</option>
        <optgroup label="Pet Dog Training">
          <option value="board-train">Board &amp; Train (residential)</option>
          <option value="private-lessons">Private lessons</option>
          <option value="puppy-foundations">Puppy foundations</option>
          <option value="day-training">Day training</option>
          <option value="behavior-modification">Behavior modification (aggression, anxiety, reactivity)</option>
        </optgroup>
        <optgroup label="Working &amp; Agency">
          <option value="detection">Detection dog training</option>
          <option value="police-k9">Police K9 / patrol</option>
          <option value="sport">Sport training</option>
          <option value="protection">Personal protection</option>
          <option value="agency">Agency / department program</option>
          <option value="decoy">Decoy services</option>
          <option value="evaluation">Dog evaluation &amp; selection</option>
        </optgroup>
        <option value="unsure">I’m not sure yet—please help me choose</option>
      </select>
      <span class="err" id="serviceErr" data-show="false">Please choose a service.</span>
    </div>
  </fieldset>

  <div class="frow frow2">
    <div class="field">
      <label for="owner">Name <span class="req" aria-hidden="true">*</span></label>
      <input id="owner" name="owner" type="text" autocomplete="name" required aria-describedby="ownerErr" />
      <span class="err" id="ownerErr" data-show="false">Please enter your name.</span>
    </div>
    <div class="field">
      <label for="email">Email <span class="req" aria-hidden="true">*</span></label>
      <input id="email" name="email" type="email" autocomplete="email" inputmode="email" required aria-describedby="emailErr" />
      <span class="err" id="emailErr" data-show="false">Please enter a valid email address.</span>
    </div>
  </div>

  <div class="frow frow2">
    <div class="field">
      <label for="phone">Phone <span class="req" aria-hidden="true">*</span></label>
      <input id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required aria-describedby="phoneErr phoneHint" />
      <span class="hint" id="phoneHint">Used for your consultation. 10-digit US number.</span>
      <span class="err" id="phoneErr" data-show="false">Please enter a 10-digit phone number.</span>
    </div>
    <div class="field">
      <label for="dogName">Dog name</label>
      <input id="dogName" name="dogName" type="text" autocomplete="off" />
    </div>
  </div>

  <div class="frow frow3">
    <div class="field">
      <label for="city">City <span class="req" aria-hidden="true">*</span></label>
      <input id="city" name="city" type="text" autocomplete="address-level2" required aria-describedby="cityErr" />
      <span class="err" id="cityErr" data-show="false">Please enter your city.</span>
    </div>
    <div class="field">
      <label for="state">State</label>
      <select id="state" name="state" autocomplete="address-level1"><option>TX</option><option>Other</option></select>
    </div>
    <div class="field">
      <label for="dogInfo">Dog’s breed and age</label>
      <input id="dogInfo" name="dogInfo" type="text" placeholder="e.g. GSD, 14 months" />
    </div>
  </div>

  <fieldset>
    <legend class="fl-legend">When would you like to begin?</legend>
    <div class="radios radios-row" style="margin-top:.85rem">
      <label class="radio"><input type="radio" name="timeline" value="asap" /><span>As soon as possible<small>In the next two weeks</small></span></label>
      <label class="radio"><input type="radio" name="timeline" value="30-days" /><span>Within a month<small>I’m planning ahead</small></span></label>
      <label class="radio"><input type="radio" name="timeline" value="researching" /><span>I’m exploring options<small>No rush to start</small></span></label>
    </div>
  </fieldset>

  <div class="field">
    <label for="message">What would you like life with your dog to look like?</label>
    <textarea id="message" name="message" placeholder="Share what’s going well, what you’d like to change, and anything that could help us understand your dog—such as health needs, training history or other pets at home."></textarea>
  </div>

  <div class="field">
    <label for="heard">How did you hear about us?</label>
    <select id="heard" name="heard">
      <option value="">Select</option>
      <option value="google-search">Google search</option>
      <option value="google-ads">Google ad</option>
      <option value="facebook">Facebook</option>
      <option value="instagram">Instagram</option>
      <option value="tiktok">TikTok</option>
      <option value="referral">Referred by a client</option>
      <option value="vet">Veterinarian or vet staff</option>
      <option value="agency">Another agency or department</option>
      <option value="event">Event or class</option>
      <option value="other">Other</option>
    </select>
  </div>

  <fieldset>
    <legend class="fl-legend">How may we contact you? <span class="req" aria-hidden="true">*</span></legend>
    <p class="hint">Choose at least one way for us to reply about your inquiry.</p>
    <div style="display:grid;gap:.7rem;margin-top:.85rem">
      <label class="consent"><input type="checkbox" id="consentEmail" name="consentEmail" /><span>Email me about this inquiry and Taurus K9 services.</span></label>
      <label class="consent"><input type="checkbox" id="consentSms" name="consentSms" /><span>Text me about this inquiry. Message frequency varies; message and data rates may apply. Reply STOP to unsubscribe. Consent is not a condition of purchase.</span></label>
    </div>
    <span class="err" id="consentErr" data-show="false" style="margin-top:.6rem">Select at least one way for us to contact you.</span>
  </fieldset>

  <div>
    <button class="btn btn-p btn-blk" type="submit" data-track="form_submit" style="min-height:54px">Check my inquiry</button>
    <p class="fnote" style="margin-top:.75rem">This online form is not connected yet, so nothing entered here will be sent. To book or ask a question, call <a href="tel:${SITE.phone}" style="color:var(--ink)">${SITE.phoneDisplay}</a> or email <a href="mailto:${SITE.email}" style="color:var(--ink)">${SITE.email}</a>.</p>
    <p class="fnote" style="margin-top:.75rem">Please don’t enter sensitive information. Read our <a href="#/privacy">Privacy Policy</a>.</p>
  </div>

  <details style="margin-top:.5rem">
    <summary style="cursor:pointer;font-weight:700;color:var(--muted);font-size:.88rem">Preview information (not sent)</summary>
    <div class="crm" style="margin-top:.75rem">
      <h4>This preview is for display only—nothing is sent.</h4>
      <div class="score">
        <span class="score__v" id="scoreVal">0</span>
        <div class="score__bar"><div class="score__fill" id="scoreFill"></div></div>
        <span id="scoreTier" style="font-weight:700;color:#242021">&mdash;</span>
      </div>
      <pre id="crmPreview">{}</pre>
    </div>
  </details>
</form>`;
}

function utm(){
  const out = {};
  const raw = location.hash || '';
  const qi = raw.indexOf('?');
  if(qi > -1){
    raw.slice(qi + 1).split('&').forEach(p => {
      const kv = p.split('=');
      if(kv[0]) out[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
    });
  }
  const sp = new URLSearchParams(location.search);
  ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid','msclkid'].forEach(k => {
    if(sp.get(k)) out[k] = sp.get(k);
  });
  return out;
}

function hashParam(k){
  const raw = (location.hash || '').replace(/^#/, '');
  const qi = raw.indexOf('?');
  if(qi < 0) return '';
  const sp = new URLSearchParams(raw.slice(qi + 1));
  return sp.get(k) || '';
}

function scoreLead(d){
  let s = 0;
  const why = [];
  if(d.phone){ s += 15; why.push('phone provided (+15)'); }
  if(d.email){ s += 10; why.push('email provided (+10)'); }
  if(d.timeline === 'asap'){ s += 20; why.push('wants to start immediately (+20)'); }
  else if(d.timeline === '30-days'){ s += 12; why.push('start within 30 days (+12)'); }
  if(d.service === 'board-train'){ s += 15; why.push('high-value service: Board and Train (+15)'); }
  if(['agency','police-k9','detection','protection','sport'].indexOf(d.service) > -1){ s += 20; why.push('commercial or agency intent (+20)'); }
  if(d.message && d.message.length > 40){ s += 10; why.push('detailed description (+10)'); }
  const local = SITE.cities.map(c => c.toLowerCase());
  if(d.city && local.indexOf(d.city.trim().toLowerCase()) > -1){ s += 15; why.push('in core service area (+15)'); }
  if(d.dogInfo){ s += 5; why.push('dog details given (+5)'); }
  if(d.heard){ s += 5; why.push('attribution captured (+5)'); }
  const u = utm();
  if(u.utm_medium === 'cpc' || u.gclid || u.fbclid){ s += 10; why.push('paid traffic source (+10)'); }
  s = Math.min(100, s);
  const tier = s >= 70 ? 'Hot: contact within 1 hour' : (s >= 40 ? 'Warm: contact within 4 business hours' : 'Nurture: 1 business day');
  return {score:s, tier:tier, reasons:why};
}

function buildPayload(d){
  const sc = scoreLead(d);
  const now = new Date().toISOString();
  const isWork = ['agency','detection','police-k9','decoy','evaluation','sport','protection'].indexOf(d.service) > -1;
  return {
    submittedAt: now,
    page: location.hash || '#/',
    attribution: utm(),
    contact: {
      firstname: d.owner,
      email: d.email,
      phone_e164: d.phone ? '+1' + d.phone.replace(/\D/g,'') : '',
      city: d.city,
      state: d.state,
      lifecyclestage: 'lead'
    },
    dog: { name: d.dogName, breed_age: d.dogInfo },
    inquiry: { service: d.service, tier: d.tier, timeline: d.timeline, notes: d.message, heard: d.heard },
    consent: {
      email: {
        granted: !!d.consentEmail,
        text: 'Email me about my inquiry and Taurus K9 services',
        capturedAt: now,
        source: 'taurusk9.com contact form'
      },
      sms: {
        granted: !!d.consentSms,
        text: 'Yes, text me about my inquiry. Message frequency varies; msg and data rates may apply. Reply STOP to unsubscribe.',
        capturedAt: now,
        source: 'taurusk9.com contact form'
      }
    },
    scoring: { score: sc.score, tier: sc.tier, reasons: sc.reasons },
    routing: {
      owner: isWork ? 'Working Dog Division (Greg)' : 'Pet Division (Rebecca)',
      pipeline: isWork ? 'Agency and Working K9' : 'Pet Training',
      dealstage: 'New Inquiry',
      sla: sc.score >= 70 ? '60 minutes' : '1 business day'
    },
    dedupeKey: 'email'
  };
}

function wireForm(){
  const form = document.getElementById('leadForm');
  if(!form) return;

  const pre = hashParam('service');
  if(pre){ const sel = document.getElementById('service'); if(sel) sel.value = pre; }
  const tier = hashParam('tier');
  if(tier){ form.dataset.tier = tier; }

  const errm = document.getElementById('errm');
  const errList = document.getElementById('errList');

  function setErr(id, flag){
    const el = document.getElementById(id);
    const e = document.getElementById(id + 'Err');
    if(e) e.setAttribute('data-show', flag ? 'true' : 'false');
    if(el) el.setAttribute('aria-invalid', flag ? 'true' : 'false');
  }

  function collect(){
    const g = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    const c = id => { const el = document.getElementById(id); return el ? el.checked : false; };
    const r = form.querySelector('input[name="timeline"]:checked');
    return {
      service: g('service'), owner: g('owner'), email: g('email'), phone: g('phone'),
      city: g('city'), state: g('state'), dogName: g('dogName'), dogInfo: g('dogInfo'),
      message: g('message'), heard: g('heard'), timeline: r ? r.value : '',
      tier: form.dataset.tier || '', consentEmail: c('consentEmail'), consentSms: c('consentSms'),
      company: g('company')
    };
  }

  function updatePreview(){
    const d = collect();
    const sc = scoreLead(d);
    const sv = document.getElementById('scoreVal');
    const sf = document.getElementById('scoreFill');
    const st = document.getElementById('scoreTier');
    const box = document.getElementById('crmPreview');
    if(sv) sv.textContent = sc.score;
    if(sf) sf.style.width = sc.score + '%';
    if(st) st.textContent = sc.tier;
    if(box) box.textContent = JSON.stringify(buildPayload(d), null, 2);
  }

  form.addEventListener('input', updatePreview);
  form.addEventListener('change', updatePreview);
  updatePreview();

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const d = collect();
    const errs = [];
    ['service','owner','email','phone','city'].forEach(id => setErr(id, false));
    document.getElementById('consentErr').setAttribute('data-show','false');
    const errHeading = errm.querySelector('h3');
    if(errHeading) errHeading.textContent = 'Let’s take care of a few details';

    if(d.company){ location.hash = '#/thank-you'; return; }

    if(!d.service){     setErr('service', true); errs.push(['service','Choose the service you’re interested in.']); }
    if(!d.owner){     setErr('owner', true); errs.push(['owner','Enter your name.']); }
    if(!d.email || !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(d.email)){
      setErr('email', true); errs.push(['email','Enter a valid email address.']);
    }
    if(!d.phone || d.phone.replace(/\D/g,'').length < 10){
      setErr('phone', true); errs.push(['phone','Enter a 10-digit phone number.']);
    }
    if(!d.city){ setErr('city', true); errs.push(['city','Enter your city.']); }
    if(!d.consentEmail && !d.consentSms){
      document.getElementById('consentErr').setAttribute('data-show','true');
      errs.push(['consentEmail','Choose at least one way for us to contact you.']);
    }

    if(errs.length){
      errList.innerHTML = errs.map(x => `<li><a href="#${x[0]}">${x[1]}</a></li>`).join('');
      errm.setAttribute('data-show','true');
      errm.focus();
      track('form_error', {error_count: errs.length});
      return;
    }

    if(errHeading) errHeading.textContent = 'Your inquiry is ready—but this form is not connected yet';
    errList.innerHTML = `<li>Nothing was sent. Call <a href="tel:${SITE.phone}">${SITE.phoneDisplay}</a> or email <a href="mailto:${SITE.email}">${SITE.email}</a>, and we’ll help you take the next step.</li>`;
    errm.setAttribute('data-show','true');
    errm.focus();
  });
}

/* ---------- pages ---------- */

const PAGES = {};

PAGES['/'] = {
  title:'Taurus K9 | Dog Training in Aransas Pass & the Coastal Bend',
  desc:'Practical, low-stress dog training for family dogs and working K9 teams in Aransas Pass, Corpus Christi and the Texas Coastal Bend.',
  render(){
    const trows = [
      {href:'#/pet-training', ic:I.home, t:'Pet Dog Training', d:'Board &amp; Train, private lessons, puppy foundations and day training for the life you share.'},
      {href:'#/working-dogs', ic:I.shield, t:'Specialty &amp; Working Dogs', d:'Sport, detection and police K9 training, supported by certified decoys and realistic scenarios.'}
    ].map(x => `<div class="trow">
        <span class="trow__ic" aria-hidden="true">${x.ic}</span>
        <div>
          <strong>${x.t}</strong>
          <span>${x.d}</span><br>
          <a href="${x.href}">Explore ${x.t}</a>
        </div>
      </div>`).join('');

    return hero({
      tag:'Clear training. Confident dogs.',
      title:'Build a dog who listens at home, on walks and in the moments that matter.',
      lede:'We train family dogs and working K9 teams across the Texas Coastal Bend. First, we get to know your dog and your goals. Then we give you a clear plan, regular progress updates and honest guidance at every step.',
      actions:`${CTAB}<a class="btn btn-o" href="#/pet-training">See all programs</a>`,
      mini:['Free, in-person meet and greet','Certified Police K9 Master Trainers','Regular progress updates','Programs for handlers and agencies'],
      aside:`<aside class="hcard" aria-labelledby="hcH">
        <h2 id="hcH">What does your dog need next?</h2>
        ${trows}
        <p>Not sure where to start? A free meet and greet gives us a chance to talk it through.</p>
      </aside>`
    })
    + sec({bg:'cream', body:`<div class="strip">
        <div><b>Police K9 Master Trainer</b><span>Tarheel Canine Inc. Graduates</span></div>
        <div><b>NEPOPO Silver School</b><span>Graduates</span></div>
        <div><b>Decoy Level 1</b><span>Demanet Academy certified</span></div>
        <div><b>21 Years</b><span>U.S. Army veteran</span></div>
      </div>`})
    + sec({
        eyebrow:'Two trainers, one shared approach', centerIntro:true,
        h2:'Family dogs and working dogs. Thoughtful training for both.',
        lede:'Greg and Rebecca work together to assess and train each dog. You may meet both, and one of them will lead your sessions based on your dog’s needs. Either way, you can expect a clear plan and consistent communication.',
        body: grid([
          card({
            icon:'<img class="card__photo" src="images/pet-dog-at-home.jpg" alt="">', tag:'Pet owners', h3:'Pet Dog Training',
            body:`<p>For families who want everyday skills that last beyond the training session—at home, on walks and around the people they love.</p>
              ${chk(['Board &amp; Train (4&ndash;12 weeks)','Private one-on-one lessons','Puppy Foundations from 8 weeks','Behavior modification for reactivity, anxiety and aggression'])}`,
            foot:`<a class="btn btn-g btn-sm" href="#/pet-training">Explore Pet Training</a>`
          }),
          card({
            icon:'<img src="images/bia-police-badge.jpg" alt="">', acc:true, tag:'Handlers and agencies', h3:'Specialty &amp; Working Dog Training',
            body:`<p>For handlers, departments and owner-operators who need capable teams, practical training and clear documentation for real-world work.</p>
              ${chk(['Sport protection and tracking','Contraband and narcotics detection','Police K9 and patrol support','Certified police decoy scenario work'])}`,
            foot:`<a class="btn btn-g btn-sm" href="#/working-dogs">Explore Working Dogs</a>`
          })
        ],'g2')
      })
    + sec({
        bg:'dark', eyebrow:'Your next steps', h2:'A clear path from first conversation to confident handling.', centerIntro:true,
        lede:'We explain the plan, timeline and cost before training begins, so you always know what comes next.',
        body: grid([
          card({step:'01', h3:'Meet and talk it through', body:'<p>We meet you and your dog, learn what matters to you, and assess temperament, routines and goals. Then we recommend a realistic next step.</p>'}),
          card({step:'02', h3:'Get a plan in writing', body:`<p>Before you decide, you’ll see the recommended program, timeline, any suggested tools and the full cost.</p>`}),
          card({step:'03', h3:'Train with regular updates', body:'<p>Board &amp; Train includes structured daily sessions in varied settings. Private lessons bring training into your home and neighborhood.</p>'}),
          card({step:'04', h3:'Bring the skills home', body:'<p>We practice handling with you, share a plan for keeping progress going and support you for three months after training ends.</p>'})
        ],'g4')
      })
    + sec({
        eyebrow:'Our approach', h2:'Good training starts with understanding your dog.', centerIntro:true,
        lede:'Experience matters. So does a plan that fits the dog in front of you.',
        body: grid([
          card({icon:I.chart, h3:'A plan for your dog', body:'<p>We begin with your dog’s temperament, history and needs—not a one-size-fits-all program.</p>'}),
          card({icon:I.paw, h3:'Motivation and clear communication', body:'<p>We use rewards and low-stress teaching to keep your dog engaged and make expectations easy to understand.</p>'}),
          card({icon:I.bolt, h3:'Skills for everyday life', body:'<p>We practice at home, on walks and in public places, so good behavior carries into the situations you actually face.</p>'}),
          card({icon:I.chat, h3:'You learn alongside your dog', body:'<p>Hands-on coaching helps you handle your dog with confidence and keep the progress going after training.</p>'})
        ],'g4')
      })
    + sec({
        bg:'cream', eyebrow:'Credentials and experience', h2:'Training grounded in experience and education', centerIntro:true,
        lede:'Greg and Rebecca bring professional education and recognized credentials in working dog development, police K9 training and decoy work.',
        body:`${grid([
            `<article class="card"><h3>Police K9 Master Trainer</h3>
              <p><strong>Tarheel Canine Inc.</strong></p>
              <p>Advanced education in patrol, detection and handler development for working dog teams.</p></article>`,
            `<article class="card"><h3>NEPOPO Silver School</h3>
              <p><strong>Graduate</strong></p>
              <p>Education in the NEPOPO® system, with a focus on motivation, clear communication and reliable behavior.</p></article>`,
            `<article class="card"><h3>Police Decoy Level 1</h3>
              <p><strong>Demanet Academy</strong></p>
              <p>Certified decoy work that gives dogs realistic scenarios in a controlled setting.</p></article>`
          ],'g3')}
          <p style="margin-top:1.5rem"><a class="btn btn-o btn-sm" href="#/about">Meet the trainers</a></p>`
      })
    + sec({body: band({})});
  }
};

PAGES['/pet-training'] = {
  title:'Pet Dog Training in Aransas Pass & the Coastal Bend | Taurus K9',
  desc:'Choose Board & Train, private lessons, Puppy Foundations or behavior support. Taurus K9 helps families across Aransas Pass, Corpus Christi and the Coastal Bend.',
  render(){
    return phero({
      tag:'Pet Dog Training',
      title:'Training that fits the life you share with your dog.',
      lede:'Build useful skills at home, on your street and out in the world. Choose the training format that fits your dog, your goals and your schedule.',
      crumbs:[{label:'Home',href:'#/'},{label:'Pet Dog Training'}],
      actions: CTAB + CTAC
    })
    + sec({h2:'Programs', body: grid([
        card({icon:I.home, tag:'Most popular', h3:'Board &amp; Train',
          body:`<p>Your dog stays with our trainers for several structured sessions each day, with practice in different real-world settings.</p><p><strong>4&ndash;12 weeks</strong>, depending on the program.</p>`,
          foot:`<a class="btn btn-g btn-sm" href="#/board-train">Compare Board &amp; Train options</a>`}),
        card({icon:I.user, h3:'Private Lessons',
          body:`<p>One-on-one coaching built around your dog’s needs, in the places you need skills most. Learn alongside your trainer.</p><p><strong>Single sessions or packages.</strong></p>`,
          foot:`<a class="btn btn-g btn-sm" href="#/private-lessons">Explore private lessons</a>`}),
        card({icon:I.paw, h3:'Puppy Foundations',
          body:`<p>Build confidence, healthy routines and good habits from 8 weeks old.</p>`,
          foot:`<a class="btn btn-g btn-sm" href="#/puppy-foundations">Explore Puppy Foundations</a>`}),
        card({icon:I.shield, acc:true, tag:'Advanced', h3:'Behavior Modification',
          body:`<p>A thoughtful, individualized plan for reactivity, anxiety or aggression, with careful management and realistic expectations.</p>`,
          foot:`<a class="btn btn-g btn-sm" href="#/board-train">Discuss behavior support</a>`}),
        card({icon:I.check, h3:'Personal Protection',
          body:`<p>For owners seeking a family dog with protective skills. Every dog and household is assessed first; this program is not right for everyone.</p>`,
          foot:`<a class="btn btn-g btn-sm" href="#/working-dogs">Explore protection training</a>`})
      ],'g2')})
    + sec({
        bg:'cream', eyebrow:'Find your fit', h2:'Which training format works for you?',
        body:`<table class="data">
          <caption>A quick comparison of training formats</caption>
          <thead><tr><th scope="col">Format</th><th scope="col">Best for</th><th scope="col">Typical length</th><th scope="col">Your involvement</th></tr></thead>
          <tbody>
            <tr><th scope="row">Board &amp; Train</th><td>Structured training with your dog staying with us</td><td>4&ndash;12 weeks</td><td>Handoff and transfer sessions</td></tr>
            <tr><th scope="row">Private Lessons</th><td>Learning handling skills with your dog</td><td>Weekly or ongoing</td><td>Every session</td></tr>
            <tr><th scope="row">Puppy Foundations</th><td>Puppies from 8 weeks to 6 months</td><td>4&ndash;8 weeks</td><td>Every session</td></tr>
            <tr><th scope="row">Behavior Modification</th><td>Reactivity, anxiety or aggression</td><td>8&ndash;12+ weeks</td><td>Consistent owner involvement</td></tr>
          </tbody>
        </table>`
      })
    + sec({body: band({h2:'Not sure where to begin? Let’s talk it through.', cta:'Schedule a Free Meet &amp; Greet'})});
  }
};

PAGES['/board-train'] = {
  title:'Board & Train in Aransas Pass & the Coastal Bend | Taurus K9',
  desc:'Focused Board & Train for everyday obedience, public reliability or behavior support. Programs run 4–12 weeks, with regular updates and a hands-on handoff.',
  render(){
    const tiers = [
      {h3:'Basic Obedience', meta:'4&ndash;6 weeks &middot; Everyday manners and listening', flag:'',
       items:['Build reliable sit, down, come, place and leave-it skills.','Practice relaxed leash walking and everyday focus.','Help your dog settle at home and greet visitors calmly.','Lay the groundwork for off-leash skills.','Practice around real-life distractions at a manageable pace.','Get regular updates on your dog’s progress.']},
      {h3:'Advanced Obedience', meta:'6&ndash;8 weeks &middot; Reliability in public', flag:'Most chosen',
       items:['Strengthen obedience and dependable responses.','Build recall and off-leash reliability where appropriate.','Practice calm manners in parks and public spaces.','Work through distractions with steady focus.','Prepare for the people, sounds and movement of everyday outings.','Get regular updates on your dog’s progress.']},
      {h3:'Behavior Modification', meta:'8&ndash;12 weeks &middot; Individual plan', flag:'',
       items:['Address reactivity, fear, aggression or resource guarding.','Build practical skills to support safer handling.','Practice calm behavior at home and in appropriate public settings.','Work through triggers with a thoughtful, structured plan.','Set routines that support progress beyond the program.','Get regular updates on your dog’s progress.']}
    ].map((t,i) => `<article class="tier${i === 1 ? ' tier-pop' : ''}">
        ${t.flag ? `<span class="tier__flag">${t.flag}</span>` : ''}
        <h3>${t.h3}</h3>
        <p class="tier__meta">${t.meta}</p>
        ${chk(t.items)}
        <p class="tier__price">Quoted per dog after your free meet and greet<span>Written scope and cost before anything starts.</span></p>
        <div class="card__f">
          <a class="btn btn-p btn-blk" href="#/contact?service=board-train&amp;tier=${encodeURIComponent(t.h3)}" data-track="cta_tier">Reserve My Dog Spot</a>
        </div>
      </article>`).join('');

    return phero({
      tag:'Board &amp; Train',
      title:'Focused training for your dog. Clear guidance for you.',
      lede:'Your dog stays with us for structured daily sessions at home and in the community. You stay informed with regular updates and learn how to carry each new skill into life at home.',
      video:'https://242184033.fs1.hubspotusercontent-na2.net/hubfs/242184033/Videos/Untitled%20-%20October%2005%2c%202026%20at%2018.40.38-3.mp4',
      crumbs:[{label:'Home',href:'#/'},{label:'Pet Dog Training',href:'#/pet-training'},{label:'Board & Train'}],
      actions: CTAB + CTAC
    })
    + sec({
        bg:'cream', h2:'Choose the right Board &amp; Train program', centerIntro:true,
        lede:`Each program includes structured daily training, regular progress updates and a hands-on handoff. We’ll help you choose an approach and timeline that fit your dog’s needs.`,
        body:`<div class="tiers">${tiers}</div>
          <p class="fnote" style="margin-top:1.25rem">These are typical program ranges. We’ll recommend a timeline based on your dog’s starting point and your goals. Training tools and related education are optional.</p>`
      })
    + sec({
        eyebrow:'A closer look', h2:'What your dog’s training looks like',
        body: grid([
          card({icon:I.bolt, h3:'Structured practice and rest', body:'<p>Your dog gets several focused sessions throughout the day, balanced with rest and time to decompress.</p>'}),
          card({icon:I.home, h3:'Practice beyond the facility', body:'<p>We work in home and community settings so your dog can use new skills where everyday life happens.</p>'}),
          card({icon:I.shield, h3:'Experienced trainers', body:'<p>Certified working-dog trainers bring a consistent approach, careful assessment and a clear plan to every program.</p>'}),
          card({icon:I.chat, h3:'Regular progress updates', body:'<p>You’ll hear how training is going throughout your dog’s stay, so you can follow along and ask questions.</p>'})
        ],'g2')
      })
    + sec({
        bg:'dark', eyebrow:'What to expect', h2:'From first meeting to homecoming', centerIntro:true,
        body: steps([
          {h3:'Meet and get to know your dog', p:'We talk through your goals and assess your dog’s temperament, current skills and needs—in person, at no charge.'},
          {h3:'Review your written plan', p:'Before you decide, you’ll receive the program recommendation, timeline, any suggested tools and the full cost.'},
          {h3:'Follow the progress', p:'Your dog trains in structured sessions, with practice in varied settings, time to rest and regular updates for you.'},
          {h3:'Learn together at handoff', p:'We coach you through the handling and skills your dog has learned, then check in to help you keep the progress going.'}
        ])
      })
    + sec({h2:'Board and Train questions', centerIntro:true, body: faqBlock(faqPick([2,3,4,9,10]))})
    + sec({bg:'cream', body: band({h2:'Spots are limited. We only board a small number of dogs at a time.', cta:'Reserve My Dog Spot'})});
  }
};

PAGES['/private-lessons'] = {
  title:'Private Dog Training Lessons in Corpus Christi & the Coastal Bend | Taurus K9',
  desc:'One-on-one private dog training lessons in your home and neighborhoods across Aransas Pass, Corpus Christi and the Coastal Bend. Customized to your goals, with handling skills for the owner.',
  render(){
    return phero({
      tag:'Private Lessons',
      title:'One-on-one training, built around your dog and your goals.',
      lede:'Some dogs need the training, some owners need the handling skills, and most need both. Private lessons put a certified trainer alongside you in your own environment, coaching the timing and communication that actually changes behavior.',
      video:'https://242184033.fs1.hubspotusercontent-na2.net/hubfs/242184033/Videos/IMG_0027.mp4',
      crumbs:[{label:'Home',href:'#/'},{label:'Pet Dog Training',href:'#/pet-training'},{label:'Private Lessons'}],
      actions: CTAB + CTAC
    })
    + sec({
        h2:'What private lessons cover', centerIntro:true,
        lede:'Lessons are customized, not scripted. These are the most common goals clients bring us.',
        body: grid([
          card({icon:I.paw, h3:'Foundational obedience', body: chk(['Sit, down, stay, place','Loose-leash walking','Coming when called','Door and threshold manners'])}),
          card({icon:I.bolt, h3:'Real-world reliability', body: chk(['Public manners and neutrality','Polite greetings with people and dogs','Off-leash reliability where appropriate','Working around distractions'])}),
          card({icon:I.shield, h3:'Behavior problems', body: chk(['Jumping, nipping, counter-surfing','Leash reactivity and barking','Anxiety and settling difficulty','Aggression, assessed first and managed honestly'])}),
          card({icon:I.chat, h3:'Owner handling skills', body: chk(['Marker timing and reward placement','Reading body language and stress signals','Consistent household rules','Crate and management strategy'])})
        ],'g2')
      })
    + sec({
        bg:'cream',         eyebrow:'Flexible coaching', h2:'Learn where the skills matter most', centerIntro:true,
        body: grid([
          card({h3:'At home', body:'<p>Work on the routines that matter where they happen—from door manners to crate comfort and settling in.</p>'}),
          card({h3:'Around your neighborhood', body:'<p>Practice on your streets, in parks and in other everyday settings so skills travel with you.</p>'}),
          card({h3:'One session or a package', body:'<p>Start with a single lesson or choose a package for a specific goal and a more sustained plan.</p>'})
        ],'g3')
      })
    + sec({h2:'Private lesson questions', centerIntro:true, body: faqBlock(faqPick([1,2,8,9]))})
    + sec({bg:'cream', body: band({h2:'Book a private lesson or start with the free meet and greet.', cta:'Book Free Meet and Greet'})});
  }
};

PAGES['/puppy-foundations'] = {
  title:'Puppy Training from 8 Weeks | Taurus K9, Coastal Bend',
  desc:'Help your puppy build confidence, healthy routines and everyday skills from 8 weeks old. Puppy Foundations is available in Aransas Pass, Corpus Christi and the Coastal Bend.',
  render(){
    return phero({
      tag:'Puppy Foundations',
      title:'Give your puppy a confident start.',
      lede:'Those early weeks are a valuable time to build good habits. We help your puppy get comfortable with new experiences, handling and home routines—at a pace that feels safe.',
      video:'https://242184033.fs1.hubspotusercontent-na2.net/hubfs/242184033/Videos/804886010.785997_7951783193232.mp4',
      crumbs:[{label:'Home',href:'#/'},{label:'Pet Dog Training',href:'#/pet-training'},{label:'Puppy Foundations'}],
      actions: CTAB + CTAC
    })
    + sec({h2:'Skills for a strong start', body: grid([
        card({icon:I.paw, h3:'Positive early experiences', body: chk(['Meet people and explore new surfaces and sounds','Notice your puppy’s comfort and stress signals','Introduce new experiences without overwhelming them','Build calm confidence around everyday activity'])}),
        card({icon:I.home, h3:'Comfortable home routines', body: chk(['Build positive crate experiences','Create a manageable potty routine','Guide mouthing toward appropriate toys','Practice settling and calm indoor behavior'])}),
        card({icon:I.check, h3:'Everyday foundations', body: chk(['Responding to their name and finding focus','Sit, down, come and place','A comfortable introduction to the leash','Learning how to learn'])}),
        card({icon:I.chat, h3:'Guidance for you', body: chk(['Know what to expect at each stage','Build positive habits around food and toys','Support safe interactions with children','Take home a practical plan for the next six months'])})
      ],'g2')})
    + sec({bg:'cream', h2:'Puppy questions', centerIntro:true, body: faqBlock(faqPick([8,0,1]))})
    + sec({body: band({h2:'Start your puppy on the right foundation.', cta:'Book Free Meet and Greet'})});
  }
};

PAGES['/day-training'] = {
  title:'Day Training for Dogs in Corpus Christi & the Coastal Bend | Taurus K9',
  desc:'Trainer-led day training sessions for dogs in Aransas Pass, Corpus Christi and the Coastal Bend. Structured daytime training with transfer sessions so handling skills become yours.',
  render(){
    return phero({
      tag:'Day Training',
      title:'Daytime training that fits your schedule—and brings you into the process.',
      lede:'A trainer works with your dog during the day, then coaches you at handoff so you know how to use those skills at home.',
      crumbs:[{label:'Home',href:'#/'},{label:'Pet Dog Training',href:'#/pet-training'},{label:'Day Training'}],
      actions: CTAB + CTAC
    })
    + sec({h2:'Could day training be a fit?', body: grid([
        card({icon:I.clock, h3:'Your weekdays are full', body:'<p>Get consistent practice for your dog while you take care of your workday and other commitments.</p>'}),
        card({icon:I.bolt, h3:'Your dog benefits from practice', body:'<p>Frequent, focused sessions can help build skills between your own training lessons.</p>'}),
        card({icon:I.chat, h3:'You want to stay hands-on', body:'<p>Your dog comes home each day, and transfer sessions help you stay connected to the training.</p>'})
      ],'g3')})
    + sec({bg:'cream', h2:'Day training questions', body: faqBlock(faqPick([0,9,1]))})
    + sec({body: band({cta:'Ask About Day Training'})});
  }
};

PAGES['/working-dogs'] = {
  title:'Police K9, Detection, Sport & Protection Dog Training in Texas | Taurus K9',
  desc:'Specialty and working dog training in Texas: sport protection, tracking, contraband and narcotics detection, police K9, patrol support and certified police decoy scenario training. Agency programs nationwide.',
  render(){
    return phero({
      tag:'Specialty &amp; Working Dog Training',
      title:'Working dogs trained for real scenarios, not demonstrations.',
      lede:'Taurus K9 trains sport, detection and police K9 teams, with experienced certified police decoys providing real-world scenario work that prepares the dog for peak performance under pressure.',
      video:'https://242184033.fs1.hubspotusercontent-na2.net/hubfs/242184033/Videos/Combined%20Videos.mp4',
      crumbs:[{label:'Home',href:'#/'},{label:'Specialty and Working Dogs'}],
      actions: CTAB + `<a class="btn btn-o" href="#/detection-agency">Agency programs</a>`
    })
    + sec({id:'sport', h2:'Disciplines we train', body: grid([
        card({icon:I.shield, tag:'Sport', h3:'Sport training',
          body:`<p>Structured development for sport handlers: obedience under drive, protection phases, tracking and precision, built progressively with clear benchmarks.</p>
            ${chk(['Obedience under high drive','Protection phase development','Tracking and scent discrimination','Trial preparation and problem-solving'])}`}),
        card({icon:I.nose, acc:true, tag:'Detection', h3:'Detection dogs',
          body:`<p>Odor imprinting and search pattern development for narcotics, contraband and other target odors, including vehicle, building and area searches.</p>
            ${chk(['Odor imprinting and indication','Vehicle, building and area search','Indirect reward and variable reinforcement','Handler education and certification prep'])}`,
          foot:`<a class="btn btn-g btn-sm" href="#/detection-agency">Detection programs</a>`}),
        card({icon:I.chat, tag:'Police K9', h3:'Police K9 training',
          body:`<p>Patrol and dual-purpose development, handler education and sustainment training for departments already working a dog.</p>
            ${chk(['Patrol and dual-purpose development','Handler and unit training days','Sustainment and re-certification support','Scenario-based team evaluation'])}`}),
        card({icon:I.bolt, acc:true, id:'protection', tag:'Civilian', h3:'Personal protection',
          body:`<p>For owners who want a trained family dog with reliable protective capability. Every dog and family is assessed individually; this is not the right fit for everyone, and we will say so.</p>
            ${chk(['Obedience first, always','Controlled protective response','Family-safe handling protocols','Clear legal and liability guidance'])}`}),
        card({icon:I.paw, tag:'Support', h3:'Certified police decoy services',
          body:`<p>Scenario work delivered by Demanet Academy Police Decoy Level 1 certified decoys: realistic pressure that builds a working dog instead of confusing it.</p>
            ${chk(['Real-world scenario pressure','Correct decoy mechanics','Safe, controlled progression','Unit-level training support'])}`}),
        card({icon:I.check, tag:'Selection', h3:'Dog evaluation and selection',
          body:`<p>Temperament, drive, nerve and suitability assessment before you invest in a working dog or a long program.</p>
            ${chk(['Temperament and nerve evaluation','Drive and hunt assessment','Suitability for discipline','Honest pass or fail reporting'])}`})
      ],'g2')})
    + sec({
        bg:'dark', eyebrow:'Our credentials', h2:'Certifications behind the working dog division', centerIntro:true,
        lede:'These are the qualifications we can document. Verify them before you hire any working dog trainer.',
        body: grid([
          card({h3:'Tarheel Canine Inc.', body:'<p><strong>Police K9 Master Trainer</strong> certification held by both Greg and Rebecca.</p>'}),
          card({h3:'NEPOPO Silver School', body:'<p>Silver School graduates, covering detection and working dog development methodology.</p>'}),
          card({h3:'Demanet Academy', body:'<p><strong>Police Decoy Level 1</strong> certification for realistic, safe scenario work.</p>'}),
          card({h3:'21 years U.S. Army', body:'<p>Greg brings two decades of military discipline and operational experience to the training field.</p>'})
        ],'g2')
      })
    + sec({
        eyebrow:'Training philosophy', h2:'Understanding the dog before writing the plan', centerIntro:true,
        body:`<div class="measure training-philosophy">
          <p>Our approach centers on comprehending the unique temperament of each dog and devising a training strategy rooted in scientific principles to achieve the ultimate training objective effectively.</p>
          <p>We employ motivational techniques to ensure the dog learns with minimal stress, going well beyond mere command teaching to instill a broader understanding of how to perform in various situations. Our guiding principle is to create an environment where the dog is primed for success.</p>
          <p>For detection work specifically, that means building reinforcement schedules the right way: indirect reward on a variable schedule, so the dog works because the behavior itself has become the win, not because a treat is visible in the handler hand. Behavior reinforced on a variable schedule is the most resistant to extinction, which is exactly what you want in the field.</p>
        </div>
        <h3 style="margin-top:2.5rem" id="decoy">Decoy services</h3>
        <div class="measure decoy-summary"><p>Scenario work is only as good as the decoy delivering it. Our decoy support is certified, safety-managed, and matched to your dog current level, building the dog up rather than overwhelming it.</p></div>`
      })
    + sec({bg:'cream', h2:'Working dog questions', centerIntro:true, body: faqBlock(faqPick([5,6,4,11]))})
    + sec({body: band({h2:'Working dog or agency program? Request a proposal.', cta:'Request a Proposal'})});
  }
};

PAGES['/detection-agency'] = {
  title:'Detection Dog Training & K9 Programs for Agencies | Taurus K9, Texas',
  desc:'Contraband and narcotics detection dog training, handler education and department K9 programs. Training days, decoy support and sustainment for police and private teams. Nationwide travel for agency contracts.',
  render(){
    return phero({
      tag:'Detection &amp; Agency Programs',
      title:'Programs for departments, units and private handlers.',
      lede:'Whether you are starting a dog, fixing a handling problem, or maintaining a certified team, we deliver training that is documented, repeatable and defensible in the field.',
      video:'https://242184033.fs1.hubspotusercontent-na2.net/hubfs/242184033/Videos/Greg%20Decoy.mp4',
      crumbs:[{label:'Home',href:'#/'},{label:'Specialty and Working Dogs',href:'#/working-dogs'},{label:'Detection and Agency'}],
      actions:`<a class="btn btn-p" href="#/contact?service=agency">Request Agency Proposal</a>${CTAC}`
    })
    + sec({h2:'Agency and handler services', body: grid([
        card({icon:I.nose, h3:'Detection development', body:'<p>Odor imprinting, search pattern mechanics, indication finalization, and proofing across vehicles, buildings, open area and luggage.</p>'}),
        card({icon:I.chat, h3:'Handler training days', body:'<p>Unit-level training built around your dogs, your handlers and the problems you are actually facing, not a generic curriculum.</p>'}),
        card({icon:I.paw, h3:'Certified decoy support', body:'<p>Scenario pressure delivered to standard, with correct mechanics and safe progression for patrol and protection work.</p>'}),
        card({icon:I.chart, h3:'Sustainment programs', body:'<p>Recurring maintenance to keep certified teams sharp between annual certifications, with documented progress.</p>'}),
        card({icon:I.check, h3:'Selection and procurement', body:'<p>Independent evaluation of candidate dogs so departments invest in the right dog instead of inheriting a problem.</p>'}),
        card({icon:I.shield, h3:'Private handler support', body:'<p>Owner-operators in security, recovery and specialized fields: training and maintenance for working teams outside law enforcement.</p>'})
      ],'g2')})
    + sec({
        bg:'cream', eyebrow:'Scope', h2:'How a contract typically runs', centerIntro:true,
        body: steps([
          {h3:'Needs assessment', p:'A call or visit to define the discipline, the number of teams, current certification status and the outcomes your unit needs.'},
          {h3:'Written proposal', p:'Scope, duration, travel, deliverables and cost. Clear enough to submit internally for approval.'},
          {h3:'Delivery on site', p:'We come to you. Training days, decoy support and handler education delivered against the agreed plan.'},
          {h3:'Documentation and sustainment', p:'Progress records, a maintenance schedule and re-certification support so the capability survives after we leave.'}
        ]) + `<p class="fnote" style="margin-top:1.5rem">We travel for agency contracts and quote in all 50 states. Certificate of insurance available on request.</p>`
      })
    + sec({
        eyebrow:'Real-world example', h2:'Contraband detection in a sober living community', centerIntro:true,
        body:`<div class="measure training-philosophy">
          <p>A recent placement: a contraband (narcotics) detection dog with rock-solid obedience, working periodic sweeps to protect the sanctuary of a residential recovery home. Every sweep adds a layer of accountability, safety and peace of mind for residents.</p>
          <p>What that work looks like: precision narcotics detection on real odors, flawless obedience around real-world distractions, and reward delivered through an indirect reward system on a variable reinforcement schedule. The dog never knows exactly when the reward is coming, because the work itself has become the win.</p>
          <p>If your facility, venue or organization needs detection capability, we build the dog and train the handler.</p>
        </div>`
      })
    + sec({bg:'cream', h2:'Agency questions', centerIntro:true, body: faqBlock(faqPick([6,5,11,7]))})
    + sec({body: band({h2:'Talk to the working dog division.', p:'Tell us your discipline, your team size and your timeline. We will tell you what is realistic and send a written proposal.', cta:'Request a Proposal'})});
  }
};

PAGES['/about'] = {
  title:'About Taurus K9 | Certified Dog Trainers in Aransas Pass, Texas',
  desc:'Meet the Taurus K9 team: Greg and Rebecca, Police K9 Master Trainers (Tarheel Canine Inc.), NEPOPO Silver School graduates and Demanet Academy certified police decoys. Our story and training philosophy.',
  render(){
    return phero({
      tag:'About Us',
      title:'Get to know us, then let us meet.',
      lede:'Taurus K9 was founded with a mission to provide exceptional dog training services that transform both dogs and their owners. See the difference our passion and expertise can make for your dog.',
      crumbs:[{label:'Home',href:'#/'},{label:'About Us'}],
      actions: CTAB + CTAC
    })
    + sec({
        bg:'cream', eyebrow:'Our story', h2:'Built to serve both ends of the leash', centerIntro:true,
        body:`<div class="measure training-philosophy">
          <p>Taurus K9 was founded with a mission to provide exceptional dog training services that transform both dogs and their owners. Our team of certified trainers brings years of experience in obedience, behavior modification, and specialized working dog techniques.</p>
          <p>We believe in positive reinforcement methods combined with clear communication to create lasting results. Whether you have a new puppy or an adult dog with behavioral challenges, we have the expertise to help.</p>
          <p style="font-weight:700;color:var(--ink)">Our philosophy is simple: every dog deserves training that enhances their life and strengthens their bond with their family.</p>
          <p>That philosophy is why we train pet dogs and working dogs under one roof. A family dog learning to settle on a mat and a police K9 holding an indication in a parking lot are doing the same thing: making choices under pressure. The standard does not change; only the environment does.</p>
        </div>`
      })
    + sec({
        eyebrow:'Meet the team', h2:'Certified professionals dedicated to your dog success',
        body: grid([
          `<article class="card"><div class="person">
            <span class="av" aria-hidden="true">G</span>
            <div>
              <h3>Greg</h3>
              <p class="person__r">Trainer &middot; Working Dog Division</p>
              <p>A 21-year Army veteran, Greg brings military discipline and unwavering dedication to his dog training, which leads to proven results.</p>
              <ul class="cred">
                <li>Tarheel Canine Inc. &mdash; Police K9 Master Trainer</li>
                <li>NEPOPO Silver School</li>
                <li>Demanet Academy &mdash; Police Decoy LVL 1</li>
              </ul>
            </div>
          </div></article>`,
          `<article class="card"><div class="person">
            <span class="av av-b" aria-hidden="true">R</span>
            <div>
              <h3>Rebecca</h3>
              <p class="person__r">Trainer &middot; Pet and Behavior</p>
              <p>Rebecca training approach is second to none, combining unparalleled expertise with a personalized touch that delivers exceptional results for every dog.</p>
              <ul class="cred">
                <li>Tarheel Canine Inc. &mdash; Police K9 Master Trainer</li>
                <li>NEPOPO Silver School</li>
              </ul>
            </div>
          </div></article>`
        ],'g2')
      })
    + sec({
        bg:'dark', eyebrow:'Certifications', centerIntro:true,
        h2:'We maintain the highest standards in training education and methodology',
        body: grid([
          card({h3:'Tarheel Canine Inc.', body:'<p>Police K9 Master Trainer certification, a recognized credential in the working dog community.</p>'}),
          card({h3:'NEPOPO Silver School', body:'<p>Completion of the Silver School curriculum in working dog development.</p>'}),
          card({h3:'Demanet Academy', body:'<p>Police Decoy Level 1 certification for safe, realistic scenario work.</p>'}),
          card({h3:'Ongoing education', body:'<p>We continue developing methodology rather than repeating what we learned years ago.</p>'})
        ],'g2')
      })
    + sec({
        eyebrow:'How we train', h2:'Set the dog up for success',
        body: grid([
          card({icon:I.chart, h3:'Assess the individual', body:'<p>Every plan starts with the dog temperament, drives and history, not a script.</p>'}),
          card({icon:I.paw, h3:'Motivational methods', body:'<p>Low-stress learning and clear reinforcement produce faster, more durable results than pressure.</p>'}),
          card({icon:I.chat, h3:'Clear communication', body:'<p>Consistency and timing from the handler matter as much as anything we do with the dog.</p>'}),
          card({icon:I.bolt, h3:'Beyond commands', body:'<p>We teach the dog how to perform in varied situations, so behavior survives the real world.</p>'})
        ],'g2')
      })
    + sec({bg:'cream', body: band({cta:'Schedule Free Meet and Greet'})});
  }
};

PAGES['/reviews'] = {
  title:'Reviews & Transformations | Taurus K9 Dog Training, Coastal Bend TX',
  desc:'Client reviews for Taurus K9 dog training in Aransas Pass, Corpus Christi and the Texas Coastal Bend, including Board and Train, private lessons, behavior modification and agency K9 programs.',
  render(){
    return phero({
      tag:'Reviews &amp; Transformations',
      title:'Real clients, real transformations.',
      lede:'The proof of a training program is what happens thirty days after handoff. These are the outcomes clients report.',
      crumbs:[{label:'Home',href:'#/'},{label:'Reviews'}],
      actions: CTAB
    })
    + sec({
        body:`<p class="disc" style="margin-bottom:1.75rem"><strong>Template content, replace before launch.</strong> Do not publish invented testimonials. Pull your real Google and Facebook reviews, keep the wording verbatim, and only add Review structured data for reviews you can verify.</p>
          ${grid(REVIEWS.map(revBlock),'g2')}
          <div class="btnrow" style="margin-top:1.75rem">
            <a class="btn btn-o" href="https://www.facebook.com/TaurusK9LLC" target="_blank" rel="noopener" data-track="social_click" data-loc="facebook">Reviews on Facebook</a>
            <a class="btn btn-o" href="#/contact?service=board-train">Start my dog program</a>
          </div>`
      })
    + sec({
        bg:'cream', h2:'Results by program',
        body:`<table class="data">
          <caption>What clients typically report after each program</caption>
          <thead><tr><th scope="col">Program</th><th scope="col">Typical reported outcome</th><th scope="col">Timeframe</th></tr></thead>
          <tbody>
            <tr><th scope="row">Board &amp; Train, Basic</th><td>House manners, reliable commands, off-leash foundation</td><td>4&ndash;6 weeks</td></tr>
            <tr><th scope="row">Board &amp; Train, Advanced</th><td>Off-leash reliability and public manners</td><td>6&ndash;8 weeks</td></tr>
            <tr><th scope="row">Behavior Modification</th><td>Managed reactivity, reduced anxiety, household safety</td><td>8&ndash;12+ weeks</td></tr>
            <tr><th scope="row">Private Lessons</th><td>Owner handling confidence plus measurable obedience gains</td><td>Weekly</td></tr>
            <tr><th scope="row">Agency and Detection</th><td>Certification readiness and sustained field performance</td><td>Per contract</td></tr>
          </tbody>
        </table>`
      })
    + sec({body: band({})});
  }
};

PAGES['/service-area'] = {
  title:'Service Area | Dog Training in the Texas Coastal Bend & Nationwide K9 Programs',
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
        eyebrow:'Local', h2:'Cities and towns we serve in the Coastal Bend', centerLede:true,
        lede:'If you are within reasonable driving distance of Aransas Pass, contact us and we will confirm availability for your area. Board and Train clients can travel to us.',
        body:`<ul class="areas">${cityList}</ul><h3 style="margin-top:2.25rem">Counties</h3><ul class="areas">${countyList}</ul>`
      })
    + sec({
        bg:'cream', eyebrow:'Nationwide', h2:'Agency, department and working dog programs',
        centerIntro:true,
        body: grid([
          card({icon:I.shield, h3:'On-site agency delivery', body:'<p>We travel to your department or facility for unit training days, decoy support, handler education and sustainment programs. Proposals are scoped per contract, including travel.</p>'}),
          card({icon:I.nose, h3:'Detection programs anywhere', body:'<p>Detection development, imprinting and certification preparation for departments and private handlers across the United States.</p>'}),
          card({icon:I.chat, h3:'Remote consultations', body:'<p>Not local? We can consult remotely on selection, program design and training problems before committing to travel.</p>'})
        ],'g3')
      })
    + sec({h2:'Coverage questions', centerIntro:true, body: faqBlock(faqPick([7,6,0]))})
    + sec({bg:'cream', body: band({h2:'Not sure if we cover your area? Ask us.', cta:'Check My Area'})});
  }
};

PAGES['/faq'] = {
  title:'Dog Training FAQ | Taurus K9, Aransas Pass & Corpus Christi TX',
  desc:'Answers about Taurus K9 dog training: methods, e-collar education, Board and Train lengths, updates, working dog programs, service area, pricing, and what happens at the free meet and greet.',
  render(){
    return phero({
      tag:'FAQ',
      title:'Answers before you hand over your dog.',
      lede:'The questions we get asked most, answered the same way we would answer them on the phone.',
      crumbs:[{label:'Home',href:'#/'},{label:'FAQ'}],
      actions: CTAB + CTAC
    })
    + sec({centerIntro:true, body: faqBlock(FAQS)})
    + sec({bg:'cream', body: band({h2:'Still have a question? Call us.', cta:'Book Free Meet and Greet'})});
  }
};

PAGES['/contact'] = {
  title:'Contact Taurus K9 | Book a Free Meet & Greet | Aransas Pass, TX',
  desc:'Book your free in-person dog training consultation with Taurus K9 in Aransas Pass, TX. Call 361-230-1932 or send an inquiry for Board and Train, private lessons, detection or police K9 programs.',
  render(){
    const hours = SITE.hours.map(h => `<li><span>${h[0]}</span><b>${h[1]}</b></li>`).join('');
    return phero({
      tag:'Contact &amp; Booking',
      title:'Book your free meet and greet.',
      lede:'Tell us about your dog and what you want to change. We will respond with the right next step, usually within one business day and often the same day during business hours.',
      crumbs:[{label:'Home',href:'#/'},{label:'Contact'}],
      actions:`<a class="btn btn-p" href="tel:${SITE.phone}" data-track="click_to_call" data-loc="contact_hero">Call ${SITE.phoneDisplay}</a>
        <a class="btn btn-o" href="${SITE.bookingUrl}" target="_blank" rel="noopener" data-track="schedule_click">Open the booking calendar</a>`
    })
    + sec({
        body:`<div class="cgrid">
          <div>
            <h2 style="margin-bottom:.35rem">Send us a training inquiry</h2>
            <p class="fnote" style="margin-bottom:1.5rem">Fields marked <span class="req" aria-hidden="true">*</span> are required. Prefer to talk? Call <a href="tel:${SITE.phone}" data-track="click_to_call" data-loc="form_intro">${SITE.phoneDisplay}</a>.</p>
            ${leadForm()}
          </div>
          <aside aria-labelledby="napH">
            <div class="card">
              <h2 id="napH" style="font-size:1.14rem">Contact details</h2>
              <ul class="nap">
                <li>${I.phone}<span><b>Phone</b><br><a href="tel:${SITE.phone}" data-track="click_to_call" data-loc="nap">${SITE.phoneDisplay}</a><br><span style="font-size:.86rem;color:var(--muted)">Mon&ndash;Fri, 6:00 AM &ndash; 6:00 PM CT</span></span></li>
                <li>${I.mail}<span><b>Email</b><br><a href="mailto:${SITE.email}" data-track="click_to_email">${SITE.email}</a></span></li>
                <li>${I.pin}<span><b>Location</b><br>${SITE.city}, ${SITE.state} ${SITE.zip}<br><span style="font-size:.86rem;color:var(--muted)">Serving the Coastal Bend. Exact address confirmed at booking.</span></span></li>
                <li>${I.clock}<span><b>Hours</b><ul class="hours">${hours}</ul></span></li>
              </ul>
              <div class="btnrow" style="margin-top:1.25rem">
                <a class="btn btn-g btn-sm" href="tel:${SITE.phone}" data-track="click_to_call" data-loc="nap_btn">Call now</a>
                <a class="btn btn-o btn-sm" href="sms:${SITE.phone}" data-track="click_to_text" data-loc="nap_btn">Text us</a>
              </div>
            </div>
            <div class="card" style="margin-top:1.25rem">
              <h2 style="font-size:1.14rem">What happens next</h2>
              <ol style="margin:0;padding-left:1.2rem;font-size:.94rem">
                <li>We confirm your inquiry, usually within one business day.</li>
                <li>We schedule your free in-person meet and greet.</li>
                <li>You get a written program recommendation and quote.</li>
                <li>You decide. No deposit required to talk.</li>
              </ol>
            </div>
            <div class="card" style="margin-top:1.25rem">
              <h2 style="font-size:1.14rem">Working dogs and agencies</h2>
              <p style="font-size:.94rem">Select <em>Agency or department program</em> or <em>Detection dog training</em> in the form and your inquiry is routed to the working dog division for a proposal.</p>
            </div>
          </aside>
        </div>`
      })
    + sec({bg:'cream', h2:'Before you book, these may help', centerIntro:true, body: faqBlock(FAQS.slice(0,4))});
  }
};

PAGES['/thank-you'] = {
  title:'Contact Taurus K9 | Online Inquiry Unavailable',
  desc:'The online inquiry form is not connected. Contact Taurus K9 by phone or email.',
  render(){
    return phero({
      tag:'Online inquiry unavailable',
      title:'Your inquiry was not sent.',
      lede:'The online inquiry form is not connected. Please contact Taurus K9 directly by phone or email.',
      crumbs:[{label:'Home',href:'#/'},{label:'Contact'}],
      actions:`<a class="btn btn-p" href="tel:${SITE.phone}">Call ${SITE.phoneDisplay}</a>
        <a class="btn btn-o" href="mailto:${SITE.email}">Email ${SITE.email}</a>`
    })
    + sec({h2:'Need to reach us?', body:`<p>Call <a href="tel:${SITE.phone}" style="color:var(--ink)">${SITE.phoneDisplay}</a> or email <a href="mailto:${SITE.email}" style="color:var(--ink)">${SITE.email}</a> to arrange your free meet and greet.</p>`});
  }
};

PAGES['/privacy'] = {
  title:'Privacy Policy | Taurus K9',
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
};

PAGES['/accessibility'] = {
  title:'Accessibility Statement | Taurus K9',
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
};

PAGES['/terms'] = {
  title:'Terms of Service | Taurus K9',
  desc:'Terms governing the use of taurusk9.com and the purchase of dog training services from Taurus K9, including booking, payment, cancellation and liability provisions.',
  render(){
    return phero({title:'Terms of Service', lede:'The terms that govern our website and training services.', crumbs:[{label:'Home',href:'#/'},{label:'Terms of Service'}]})
    + sec({
        body:`<div class="prose">
          <div class="note"><p><strong>Template notice.</strong> General informational terms only, not legal advice. Have counsel draft or review your final agreements, and confirm insurance, vaccination and liability language with your carrier.</p></div>
          <p><em>Last updated: [DATE]</em></p>
          <h2>Agreement</h2><p>By using www.taurusk9.com or purchasing services from Taurus K9, you agree to these terms. If you do not agree, do not use the site or services.</p>
          <h2>Services</h2><p>We provide dog training services including Board and Train, private lessons, puppy programs, day training, behavior modification, and working dog or agency programs. Program scope and pricing are confirmed in writing before training begins. Program lengths quoted are typical ranges; actual duration depends on the individual dog.</p>
          <h2>Booking and payment</h2><p>[DEPOSIT TERMS] [PAYMENT SCHEDULE] [ACCEPTED PAYMENT METHODS] Reservations may require a deposit. Balances are due as stated in your agreement.</p>
          <h2>Cancellation and rescheduling</h2><p>[CANCELLATION WINDOW] [RESCHEDULING POLICY] [REFUND POLICY, if any]. Please give us as much notice as possible so we can offer the slot to another client.</p>
          <h2>Health, vaccinations and behavior disclosure</h2><p>You agree to disclose your dog known health conditions, medications, bite history and prior training. You confirm your dog is current on vaccinations and free of communicable illness, or that a veterinarian has cleared training. Failure to disclose a bite history or aggression may result in termination of services.</p>
          <h2>Risk and liability</h2><p>Working with animals involves inherent risk. [LIABILITY LANGUAGE TO BE COMPLETED WITH COUNSEL AND INSURER.] Taurus K9 carries business insurance; a certificate of insurance is available on request.</p>
          <h2>Training tools</h2><p>Where training tools are used, they are optional and introduced through proper imprinting, conditioning and handler education. You may decline their use.</p>
          <h2>Intellectual property</h2><p>Site content, written training plans and materials are the property of Taurus K9 and may not be reproduced or redistributed without permission.</p>
          <h2>Photography and media</h2><p>Unless you opt out in writing, you grant Taurus K9 permission to use photographs or video of your dog taken during training for our website and social media. We will not publish your full name or address without consent.</p>
          <h2>Limitation of warranties</h2><p>Training outcomes depend on many factors including the dog, the environment and client follow-through. We do not guarantee a specific result. We commit to applying professional standards and delivering the program described in your agreement.</p>
          <h2>Governing law</h2><p>These terms are governed by the laws of the State of Texas. Venue for disputes lies in [COUNTY] County, Texas.</p>
          <h2>Contact</h2><p>Taurus K9 &middot; Aransas Pass, TX 78336 &middot; <a href="mailto:${SITE.email}">${SITE.email}</a> &middot; <a href="tel:${SITE.phone}">${SITE.phoneDisplay}</a></p>
        </div>`
      });
  }
};

PAGES['/404'] = {
  title:'Page Not Found | Taurus K9',
  desc:'That page could not be found. Browse Taurus K9 dog training programs or contact us in Aransas Pass, Texas.',
  render(){
    return phero({
      tag:'404 error',
      title:'That page did not hold the command.',
      lede:'We could not find what you were looking for. Here are the paths people usually want.'
    })
    + sec({body: grid([
        card({icon:I.home, h3:'Pet Dog Training', body:'<p>Board and Train, private lessons, puppy foundations and day training.</p>', foot:'<a class="btn btn-g btn-sm" href="#/pet-training">Go to Pet Training</a>'}),
        card({icon:I.shield, h3:'Working Dogs', body:'<p>Detection, police K9, sport, protection and decoy services.</p>', foot:'<a class="btn btn-g btn-sm" href="#/working-dogs">Go to Working Dogs</a>'}),
        card({icon:I.chat, h3:'Contact Us', body:`<p>Book a free meet and greet or call ${SITE.phoneDisplay}.</p>`, foot:'<a class="btn btn-g btn-sm" href="#/contact">Go to Contact</a>'})
      ],'g3')});
  }
};

/* ---------- tracking (consent aware) ---------- */

const CONSENT = {analytics:true, marketing:false};

function track(name, params){
  if(!CONSENT.analytics && !CONSENT.marketing) return;
  window.__dataLayer = window.__dataLayer || [];
  const ev = Object.assign({event:name, page_path:location.hash || '#/'}, params || {});
  window.__dataLayer.push(ev);
  /* In production: gtag('event', name, params); fbq('trackCustom', name, params); */
}

document.addEventListener('click', function(e){
  const a = e.target.closest ? e.target.closest('[data-track]') : null;
  if(!a) return;
  const n = a.getAttribute('data-track');
  const loc = a.getAttribute('data-loc') || '';
  if(n !== 'form_submit'){
    track(n, {location:loc});
  }
});

/* ---------- newsletter ---------- */

function wireNews(){
  const f = document.getElementById('newsForm');
  if(!f) return;
  f.addEventListener('submit', function(e){
    e.preventDefault();
    const input = document.getElementById('nlEmail');
    const st = document.getElementById('nlStatus');
    const v = (input.value || '').trim();
    if(!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v)){
      st.textContent = 'Please enter a valid email address.';
      st.style.color = '#242021';
      input.setAttribute('aria-invalid','true');
      input.focus();
      return;
    }
    input.removeAttribute('aria-invalid');
    st.textContent = 'You are subscribed. Welcome to the pack. Look for training tips and program updates.';
    st.style.color = '#8fd6ae';
    f.reset();
    track('newsletter_signup', {});
  });
}

/* ---------- cookie consent ---------- */

function wireCookies(){
  const bar = document.getElementById('cookie');
  const prefs = document.getElementById('prefs');
  const save = document.getElementById('ckSave');
  const tog = document.getElementById('ckPrefs');
  const show = () => bar.setAttribute('data-show','true');
  const hide = () => bar.setAttribute('data-show','false');

  setTimeout(show, 700);

  document.getElementById('ckAccept').addEventListener('click', function(){
    CONSENT.analytics = true; CONSENT.marketing = true;
    hide();
    track('consent_update', {analytics:true, marketing:true});
  });
  document.getElementById('ckReject').addEventListener('click', function(){
    CONSENT.analytics = false; CONSENT.marketing = false;
    hide();
  });
  tog.addEventListener('click', function(){
    const open = prefs.getAttribute('data-show') !== 'true';
    prefs.setAttribute('data-show', open ? 'true' : 'false');
    tog.setAttribute('aria-expanded', open ? 'true' : 'false');
    save.style.display = open ? 'inline-flex' : 'none';
  });
  save.addEventListener('click', function(){
    CONSENT.analytics = document.getElementById('prefAnalytics').checked;
    CONSENT.marketing = document.getElementById('prefAds').checked;
    hide();
    track('consent_update', {analytics:CONSENT.analytics, marketing:CONSENT.marketing});
  });
  document.getElementById('ckSettings').addEventListener('click', function(){
    prefs.setAttribute('data-show','true');
    tog.setAttribute('aria-expanded','true');
    save.style.display = 'inline-flex';
    show();
    bar.scrollIntoView({block:'end'});
  });
}

/* ---------- navigation ---------- */

function wireNav(){
  const nav = document.getElementById('nav');
  const tog = document.getElementById('ntog');

  function closeDrops(){
    document.querySelectorAll('.dd').forEach(d => d.setAttribute('data-open','false'));
    document.querySelectorAll('.nav__b').forEach(b => b.setAttribute('aria-expanded','false'));
  }
  function setOpen(o){
    nav.setAttribute('data-open', o ? 'true' : 'false');
    tog.setAttribute('aria-expanded', o ? 'true' : 'false');
  }
  setOpen(false);

  tog.addEventListener('click', function(){ setOpen(nav.getAttribute('data-open') !== 'true'); });
  nav.addEventListener('click', function(e){ if(e.target.closest('a')){ setOpen(false); closeDrops(); } });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      if(nav.getAttribute('data-open') === 'true'){ setOpen(false); tog.focus(); }
      closeDrops();
    }
  });

  document.addEventListener('click', function(e){
    if(nav.getAttribute('data-open') === 'true' && !nav.contains(e.target) && !tog.contains(e.target)) setOpen(false);
    const b = e.target.closest ? e.target.closest('.nav__b') : null;
    if(!b){
      if(!(e.target.closest && e.target.closest('.dd'))) closeDrops();
      return;
    }
    const panel = document.getElementById(b.getAttribute('aria-controls'));
    const open = b.getAttribute('aria-expanded') !== 'true';
    closeDrops();
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    if(panel) panel.setAttribute('data-open', open ? 'true' : 'false');
  });
}

/* ---------- router + SEO ---------- */

function setMeta(id, val){
  const el = document.getElementById(id);
  if(el) el.setAttribute('content', val);
}

function renderRoute(){
  const raw = (location.hash || '#/').replace(/^#/, '') || '/';
  let path = raw.split('?')[0];
  if(path === '' || path === '/index.html') path = '/';
  const key = PAGES[path] ? path : '/404';
  const page = PAGES[key];
  const app = document.getElementById('app');

  app.innerHTML = page.render();

  document.title = page.title;
  const md = document.querySelector('meta[name="description"]');
  if(md) md.setAttribute('content', page.desc);

  const url = SITE.origin + (key === '/' ? '/' : key);
  const canon = document.getElementById('canonical');
  if(canon) canon.setAttribute('href', url);
  setMeta('ogTitle', page.title);
  setMeta('ogDesc', page.desc);
  setMeta('ogUrl', url);

  const old = document.getElementById('ldPage');
  if(old) old.remove();
  const bc = [{name:'Home', url:SITE.origin + '/'}];
  if(key !== '/'){
    const name = key.replace(/^\//,'').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    bc.push({name:name, url:SITE.origin + key});
  }
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.id = 'ldPage';
  ld.textContent = JSON.stringify({
    "@context":"https://schema.org",
    "@type":"BreadcrumbList",
    "itemListElement": bc.map((c,i) => ({"@type":"ListItem","position":i+1,"name":c.name,"item":c.url}))
  });
  document.head.appendChild(ld);

  document.querySelectorAll('[data-nav]').forEach(function(a){
    if(a.getAttribute('data-nav') === key) a.setAttribute('aria-current','page');
    else a.removeAttribute('aria-current');
  });

  const st = document.getElementById('routeStatus');
  if(st) st.textContent = document.title + ' page loaded';

  window.scrollTo(0,0);
  app.focus({preventScroll:true});

  track('page_view', {page_path:'#' + key, page_title:document.title});

  wireForm();
}

window.addEventListener('hashchange', renderRoute);

/* ---------- init ---------- */

(function init(){
  const y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();

  wireNav();
  wireNews();
  wireCookies();

  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', function(){
    toTop.setAttribute('data-show', window.scrollY > 600 ? 'true' : 'false');
  }, {passive:true});
  toTop.addEventListener('click', function(){ window.scrollTo({top:0, behavior:'smooth'}); });

  if(!location.hash) location.hash = '#/';
  renderRoute();
})();
