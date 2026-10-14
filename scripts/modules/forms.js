/* Lead form validation, CRM preview, and submission behavior. */
import { SITE, CONFIG } from '../config.js';
import { track } from './tracking.js';
export function leadForm(){
  return `<form class="form" id="leadForm" data-js="lead-form" novalidate>
  <div class="errm" id="errm" role="alert" data-show="false" tabindex="-1">
    <h3>Please fix these items</h3>
    <ul id="errList"></ul>
  </div>
  <input class="hp" type="text" name="company" tabindex="-1" autocomplete="off" aria-hidden="true" />

  <fieldset>
    <legend class="form__legend">What do you need help with? <span class="form__required" aria-hidden="true">*</span></legend>
    <p class="hint">Choose the closest match. We will confirm the details at your meet and greet.</p>
    <div class="field utility--inline-872e1f2d">
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
        <option value="unsure">Not sure yet, advise me</option>
      </select>
      <span class="err" id="serviceErr" data-show="false">Please choose a service.</span>
    </div>
  </fieldset>

  <div class="form-row form-row--two">
    <div class="field">
      <label for="owner">Your name <span class="form__required" aria-hidden="true">*</span></label>
      <input id="owner" name="owner" type="text" autocomplete="name" required aria-describedby="ownerErr" />
      <span class="err" id="ownerErr" data-show="false">Please enter your name.</span>
    </div>
    <div class="field">
      <label for="email">Email <span class="form__required" aria-hidden="true">*</span></label>
      <input id="email" name="email" type="email" autocomplete="email" inputmode="email" required aria-describedby="emailErr" />
      <span class="err" id="emailErr" data-show="false">Please enter a valid email address.</span>
    </div>
  </div>

  <div class="form-row form-row--two">
    <div class="field">
      <label for="phone">Phone <span class="form__required" aria-hidden="true">*</span></label>
      <input id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required aria-describedby="phoneErr phoneHint" />
      <span class="hint" id="phoneHint">Used for your consultation. 10-digit US number.</span>
      <span class="err" id="phoneErr" data-show="false">Please enter a 10-digit phone number.</span>
    </div>
    <div class="field">
      <label for="dogName">Dog name</label>
      <input id="dogName" name="dogName" type="text" autocomplete="off" />
    </div>
  </div>

  <div class="form-row form-row--three">
    <div class="field">
      <label for="city">City <span class="form__required" aria-hidden="true">*</span></label>
      <input id="city" name="city" type="text" autocomplete="address-level2" required aria-describedby="cityErr" />
      <span class="err" id="cityErr" data-show="false">Please enter your city.</span>
    </div>
    <div class="field">
      <label for="state">State</label>
      <select id="state" name="state" autocomplete="address-level1"><option>TX</option><option>Other</option></select>
    </div>
    <div class="field">
      <label for="dogInfo">Breed &amp; age</label>
      <input id="dogInfo" name="dogInfo" type="text" placeholder="e.g. GSD, 14 months" />
    </div>
  </div>

  <fieldset>
    <legend class="form__legend">How soon do you want to start?</legend>
    <div class="radios radios-row utility--inline-872e1f2d">
      <label class="radio"><input type="radio" name="timeline" value="asap" /><span>As soon as possible<small>Within 2 weeks</small></span></label>
      <label class="radio"><input type="radio" name="timeline" value="30-days" /><span>Within 30 days<small>Planning ahead</small></span></label>
      <label class="radio"><input type="radio" name="timeline" value="researching" /><span>Just researching<small>Gathering information</small></span></label>
    </div>
  </fieldset>

  <div class="field">
    <label for="message">What would you like to change or achieve?</label>
    <textarea id="message" name="message" placeholder="Tell us what your dog does now, what you want instead, and anything we should know (bite history, health conditions, prior training, other dogs in the home)."></textarea>
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
    <legend class="form__legend">How would you like us to respond? <span class="form__required" aria-hidden="true">*</span></legend>
    <p class="hint">Choose at least one. Your choice is logged with a timestamp for your protection.</p>
    <div class="utility--inline-788820d5">
      <label class="consent"><input type="checkbox" id="consentEmail" name="consentEmail" /><span>Yes, email me about my inquiry and Taurus K9 services.</span></label>
      <label class="consent"><input type="checkbox" id="consentSms" name="consentSms" /><span>Yes, text me about my inquiry. Message frequency varies; message and data rates may apply. Reply STOP to unsubscribe. Consent is not a condition of purchase.</span></label>
    </div>
    <span class="err utility--inline-acef0958" id="consentErr" data-show="false">Please choose at least one way to contact you.</span>
  </fieldset>

  <div>
    <button class="button button--primary button--block utility--inline-b22d1b42" type="submit" data-track="form_submit">Request My Free Meet &amp; Greet</button>
    <p class="footnote utility--inline-8c40c9a5">We respond within one business day. Your information is never sold. See our <a href="#/privacy">Privacy Policy</a>.</p>
  </div>

  <details class="utility--inline-b310ca1d">
    <summary class="utility--inline-8066b6df">QA: preview the CRM record this form creates</summary>
    <div class="crm utility--inline-8c40c9a5">
      <h4>Lead record &amp; routing (HubSpot-standard)</h4>
      <div class="score">
        <span class="score__v" id="scoreVal">0</span>
        <div class="score__bar"><div class="score__fill" id="scoreFill" data-score="0"></div></div>
        <span id="scoreTier" class="utility--inline-300a4c0c">&mdash;</span>
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

export function wireForm(){
  const form = document.querySelector(CONFIG.selectors.form);
  if(!form) return;

  const pre = hashParam('service');
  if(pre){ const sel = document.querySelector(CONFIG.selectors.byId['service']); if(sel) sel.value = pre; }
  const tier = hashParam('tier');
  if(tier){ form.dataset.tier = tier; }

  const errm = document.querySelector(CONFIG.selectors.byId['errm']);
  const errList = document.querySelector(CONFIG.selectors.byId['errList']);

  function setErr(id, flag){
    const el = document.querySelector(CONFIG.selectors.byId[id]);
    const e = document.querySelector(CONFIG.selectors.byId[id + 'Err']);
    if(e) e.setAttribute('data-show', flag ? 'true' : 'false');
    if(el) el.setAttribute('aria-invalid', flag ? 'true' : 'false');
  }

  function collect(){
    const g = id => { const el = document.querySelector(CONFIG.selectors.byId[id]); return el ? el.value.trim() : ''; };
    const c = id => { const el = document.querySelector(CONFIG.selectors.byId[id]); return el ? el.checked : false; };
    const r = form.querySelector(CONFIG.selectors.timeline);
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
    const sv = document.querySelector(CONFIG.selectors.byId['scoreVal']);
    const sf = document.querySelector(CONFIG.selectors.byId['scoreFill']);
    const st = document.querySelector(CONFIG.selectors.byId['scoreTier']);
    const box = document.querySelector(CONFIG.selectors.byId['crmPreview']);
    if(sv) sv.textContent = sc.score;
    if(sf) sf.dataset.score = String(sc.score);
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
    document.querySelector(CONFIG.selectors.byId['consentErr']).setAttribute('data-show','false');

    if(d.company){ location.hash = CONFIG.routes.thankYou; return; }

    if(!d.service){ setErr('service', true); errs.push(['service',CONFIG.messages.serviceRequired]); }
    if(!d.owner){ setErr('owner', true); errs.push(['owner',CONFIG.messages.nameRequired]); }
    if(!d.email || !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(d.email)){
      setErr('email', true); errs.push(['email',CONFIG.messages.invalidEmail]);
    }
    if(!d.phone || d.phone.replace(/\D/g,'').length < 10){
      setErr('phone', true); errs.push(['phone',CONFIG.messages.phoneRequired]);
    }
    if(!d.city){ setErr('city', true); errs.push(['city',CONFIG.messages.cityRequired]); }
    if(!d.consentEmail && !d.consentSms){
      document.querySelector(CONFIG.selectors.byId['consentErr']).setAttribute('data-show','true');
      errs.push(['consentEmail',CONFIG.messages.consentRequired]);
    }

    if(errs.length){
      errList.innerHTML = errs.map(x => `<li><a href="#${x[0]}">${x[1]}</a></li>`).join('');
      errm.setAttribute('data-show','true');
      errm.focus();
      track(CONFIG.events.formError, {error_count: errs.length});
      return;
    }

    const payload = buildPayload(d);
    window.__lastLead = payload; /* replace with a real CRM POST */
    track(CONFIG.events.generateLead, {
      service: d.service,
      tier: d.tier,
      score: payload.scoring.score,
      tier_label: payload.scoring.tier
    });
    location.hash = CONFIG.routes.thankYou;
  });
}