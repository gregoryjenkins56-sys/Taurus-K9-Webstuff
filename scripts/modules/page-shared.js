/* Shared page markup, icons, and reusable content. */
import { SITE, CONFIG } from '../config.js';
export const I = {
  paw:`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="svg-icon--size-22x22"><ellipse cx="7" cy="7.5" rx="2.4" ry="3"/><ellipse cx="12" cy="6.2" rx="2.4" ry="3.1"/><ellipse cx="17" cy="7.5" rx="2.4" ry="3"/><path d="M12 11.2c3 0 5.4 2 5.4 4.6 0 2-1.7 3.2-3.6 3.2-1 0-1.4-.3-1.8-.3s-.8.3-1.8.3c-1.9 0-3.6-1.2-3.6-3.2 0-2.6 2.4-4.6 5.4-4.6Z"/></svg>`,
  shield:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="svg-icon--stroke-2-1 svg-icon--size-22x22"><path d="M12 3l7.5 3v6c0 5.2-3.4 8.4-7.5 10-4.1-1.6-7.5-4.8-7.5-10V6L12 3Z"/><path d="M9.2 12.2l2 2 3.6-4"/></svg>`,
  home:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="svg-icon--stroke-2-1 svg-icon--size-22x22"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/></svg>`,
  user:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="svg-icon--stroke-2-1 svg-icon--size-22x22"><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><circle cx="12" cy="6" r="3.2"/></svg>`,
  nose:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="svg-icon--stroke-2-1 svg-icon--size-22x22"><path d="M12 4c3.6 0 6 2.3 6 5.2 0 2.3-1.6 3.6-2.8 4.6-.9.8-1.2 1.5-1.2 2.4 0 1.3-.9 2.3-2 2.3s-2-1-2-2.3c0-.9-.3-1.6-1.2-2.4C7.6 12.8 6 11.5 6 9.2 6 6.3 8.4 4 12 4Z"/><path d="M9.5 9.5c.4.9 1.4 1.5 2.5 1.5s2.1-.6 2.5-1.5"/></svg>`,
  bolt:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="svg-icon--stroke-2-1 svg-icon--size-22x22"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/></svg>`,
  chart:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="svg-icon--stroke-2-1 svg-icon--size-22x22"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>`,
  chat:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="svg-icon--stroke-2-1 svg-icon--size-22x22"><path d="M21 12a8 8 0 1 1-3.2-6.4"/><path d="M4 20l3.8-1.2"/></svg>`,
  clock:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="svg-icon--stroke-2-1 svg-icon--size-22x22"><circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.4 2"/></svg>`,
  pin:`<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" class="svg-icon--size-16x16"><path d="M8 0C4.7 0 2 2.7 2 6c0 4.2 6 10 6 10s6-5.8 6-10c0-3.3-2.7-6-6-6Zm0 8.3A2.3 2.3 0 1 1 8 3.7a2.3 2.3 0 0 1 0 4.6Z"/></svg>`,
  phone:`<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" class="svg-icon--size-16x16"><path d="M3.6 1.4 5.5 1c.4-.1.8.1 1 .5l.8 2a.9.9 0 0 1-.2 1L6 5.9a8.7 8.7 0 0 0 4.1 4.1l1.4-1.1a.9.9 0 0 1 1-.2l2 .8c.4.2.6.6.5 1l-.4 1.9c-.1.4-.4.7-.8.7A12.4 12.4 0 0 1 2.9 2.2c0-.4.3-.7.7-.8Z"/></svg>`,
  mail:`<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" class="svg-icon--size-16x16"><path d="M1.5 3.5h13v9h-13v-9Zm1.3 1 .2.1L8 8.1l4.8-3.5.2-.1H2.8Z"/></svg>`,
  check:`<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" class="svg-icon--size-14x14"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm3.6 6.2-4.2 4.6a.9.9 0 0 1-1.3 0L4.4 9a.9.9 0 0 1 1.3-1.3l1 1 3.6-4a.9.9 0 1 1 1.3 1.3Z"/></svg>`
};

/* ---------- shared building blocks ---------- */

export const CTAB = `<a class="button button--primary" href="#/contact" data-track="cta_book">Book Free Meet &amp; Greet</a>`;
export const CTAC = `<a class="button button--outline" href="tel:${SITE.phone}" data-track="click_to_call" data-loc="hero">Call ${SITE.phoneDisplay}</a>`;

export function crumbs(items){
  if(!items || !items.length) return '';
  const li = items.map((c,i) => (c.href && i < items.length - 1)
    ? `<li><a href="${c.href}">${c.label}</a></li>`
    : `<li><span aria-current="page">${c.label}</span></li>`).join('');
  return `<nav class="crumbs wrap" aria-label="Breadcrumb"><ol>${li}</ol></nav>`;
}

export function hero(o){
  const mini = (o.mini || []).map(m => `<li>${I.check} ${m}</li>`).join('');
  return `<section class="hero hero--video">
    <video class="hero__video" autoplay muted loop playsinline>
       <source src="${CONFIG.heroVideoUrl}" type="video/mp4">
    </video>
    <div class="hero__overlay"></div>
    ${o.crumbs ? crumbs(o.crumbs) : ''}
  <div class="wrap hero__in">
    <div>
      ${o.tag ? `<span class="tag tag--pill">${o.tag}</span>` : ''}
      <h1>${o.title}</h1>
      <p class="lede">${o.lede}</p>
      ${o.actions ? `<div class="button-row utility--inline-44af57d8">${o.actions}</div>` : ''}
      ${mini ? `<ul class="hero__min">${mini}</ul>` : ''}
    </div>
    ${o.aside || ''}
  </div></section>`;
}

export function phero(o){
  return `<section class="page-hero">${crumbs(o.crumbs)}<div class="wrap page-hero__inner">
    ${o.tag ? `<span class="tag tag--pill">${o.tag}</span>` : ''}
    <h1>${o.title}</h1>
    <p class="lede">${o.lede}</p>
    ${o.actions ? `<div class="button-row utility--inline-5913c7b7">${o.actions}</div>` : ''}
  </div></section>`;
}

export function sec(o){
  return `<section class="section ${o.bg === 'dark' ? 'section--dark' : (o.bg === 'cream' ? 'section--cream' : 'section--surface')}">
    <div class="wrap">
      ${o.eyebrow ? `<span class="eyebrow">${o.eyebrow}</span>` : ''}
      ${o.h2 ? `<h2>${o.h2}</h2>` : ''}
      ${o.lede ? `<p class="lede">${o.lede}</p>` : ''}
      ${o.body || ''}
    </div></section>`;
}

export function card(o){
  return `<article class="card${o.acc ? ' card--accent' : ''}"${o.id ? ` id="${o.id}"` : ''}>
    ${o.icon ? `<span class="card__icon" aria-hidden="true">${o.icon}</span>` : ''}
    ${o.tag ? `<span class="tag${o.acc ? ' tag--brand' : ''}">${o.tag}</span>` : ''}
    <h3>${o.h3}</h3>
    ${o.body || ''}
    ${o.foot ? `<div class="card__footer">${o.foot}</div>` : ''}
  </article>`;
}

export const chk = items => `<ul class="check">${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
export const grid = (items, cls) => `<div class="grid ${cls}">${items.join('')}</div>`;

export const steps = items => `<ol class="steps">${items.map(s => `<li><h3>${s.h3}</h3><p>${s.p}</p></li>`).join('')}</ol>`;

export function band(o){
  o = o || {};
  const h2 = o.h2 || 'Ready to meet the trainers? No cost, no commitment.';
  const p = o.p || 'Book a free in-person meet &amp; greet, or call and tell us where your dog is right now. We will tell you honestly what is realistic.';
  const cta = o.cta || 'Book Free Meet &amp; Greet';
  return `<div class="band"><div><h2>${h2}</h2><p>${p}</p></div>
    <div class="button-row">
      <a class="button button--primary" href="#/contact" data-track="cta_band_book">${cta}</a>
      <a class="button button--outline" href="tel:${SITE.phone}" data-track="click_to_call" data-loc="cta_band">Call ${SITE.phoneDisplay}</a>
    </div></div>`;
}

export const faqBlock = items => `<div class="faq">${items.map(q => `<details class="q"><summary>${q.q}</summary><div class="qbody">${q.a}</div></details>`).join('')}</div>`;

export const revBlock = r => `<figure class="review">
  <div class="stars" role="img" aria-label="${r.stars} out of 5 stars">${'\u2605'.repeat(r.stars)}</div>
  <blockquote>${r.text}</blockquote>
  <figcaption><b>${r.name}</b>${r.detail}</figcaption>
</figure>`;

/* PLACEHOLDER REVIEWS - replace with verified Google and Facebook reviews before launch */
export const REVIEWS = [
  {stars:5,name:'Client name',detail:'Corpus Christi, TX &middot; Board &amp; Train, Basic Obedience',text:'Placeholder for a verified Google or Facebook review. Paste the real review text here, with the reviewer name and permission.'},
  {stars:5,name:'Client name',detail:'Aransas Pass, TX &middot; Private Lessons',text:'Placeholder for a verified review. Keep it specific to the program named in the caption so future clients can match their situation.'},
  {stars:5,name:'Client name',detail:'Rockport, TX &middot; Behavior Modification',text:'Placeholder for a verified review. Behavior modification reviews are the highest-intent social proof for this service line.'},
  {stars:5,name:'Agency or handler',detail:'Detection &amp; Police K9',text:'Placeholder for a verified review from a working dog or agency client. These build credibility with departments evaluating contracts.'}
];

export const FAQS = [
  {q:'What is a free meet &amp; greet, and what happens?',a:'<p>It is an in-person consultation, free of charge and with no commitment. You meet the trainers, we meet your dog, and we go through temperament, history, household environment and what you want to change. You leave with a straight answer on which program fits and how long it should take, not a sales pitch.</p>'},
  {q:'What training methods do you use?',a:'<p>Our approach starts with understanding the unique temperament of each dog, then builds a plan rooted in behavioral science. We use motivational techniques so the dog learns with minimal stress, pairing positive reinforcement with clear, consistent communication. The goal is never just teaching a command; it is teaching the dog how to perform in a wide range of real situations. Our guiding principle is to create an environment where the dog is set up for success.</p>'},
  {q:'Do you use e-collars?',a:'<p>We offer training-tool education as an <em>optional</em> part of many programs. If a tool is used, it is introduced properly with imprinting, conditioning and clear education for the handler first, so the tool communicates rather than corrects. We run e-collar education sessions for owners and teams who want to understand how these tools work and how to use them safely. You are never required to use one.</p>'},
  {q:'How long is Board &amp; Train, and what are the options?',a:'<p>Three tracks. <strong>Basic Obedience</strong> (4&ndash;6 weeks) covers foundation life skills and off-leash groundwork. <strong>Advanced Obedience</strong> (6&ndash;8 weeks) adds public reliability, off-leash work and public manners. <strong>Behavior Modification</strong> (8&ndash;12 weeks) is a custom plan for aggression, anxiety or reactivity. All include daily structured sessions, daily updates and varied real-world settings.</p>'},
  {q:'Will I get updates while my dog is boarding?',a:'<p>Yes. You get real-time updates and progress reports throughout your dog stay, plus a handoff session when training is complete so the behavior transfers home instead of staying with the trainer.</p>'},
  {q:'Do you train working dogs as well as pets?',a:'<p>Both. Alongside pet obedience and behavior work we train sport, detection and police K9 teams, and our certified decoys provide real-world scenario work. Our trainers hold Police K9 Master Trainer credentials through Tarheel Canine Inc., are NEPOPO Silver School graduates, and hold Demanet Academy Police Decoy Level 1 certification.</p>'},
  {q:'Do you work with law enforcement agencies and departments?',a:'<p>Yes, including unit-level training days, decoy support, handler education and sustainment. We travel for agency contracts, so departments outside the Coastal Bend can request a proposal for their team.</p>'},
  {q:'What areas do you serve?',a:'<p>Our core service area is Aransas Pass, Corpus Christi, Portland, Ingleside, Rockport, Port Aransas, Sinton, Robstown and the surrounding Coastal Bend counties. For working dog and agency programs we travel, and we quote those engagements across the United States.</p>'},
  {q:'How old should a puppy be to start?',a:'<p>Puppies can begin Puppy Foundations as early as 8 weeks. Early sessions focus on socialization, handling, household routines and the foundation that prevents problems later.</p>'},
  {q:'How much does training cost?',a:'<p>Pricing depends on the track, the program length and your dog needs, so we quote each dog individually after the meet and greet. The consultation itself is free, and you receive a written quote with the program scope before you commit to anything.</p>'},
  {q:'What if my dog has a bite history or severe aggression?',a:'<p>We assess these cases, but we handle them honestly. Some dogs need a custom behavior modification plan and a longer timeline; some need a veterinary behaviorist working alongside us. We will tell you which applies rather than take the booking and hope.</p>'},
  {q:'Are you insured?',a:'<p>Yes, Taurus K9 carries business insurance. A current certificate of insurance is available on request for agency and facility contracts.</p>'}
];

export const faqPick = idx => idx.map(i => FAQS[i]);

/* ---------- lead form (CRM) ---------- */